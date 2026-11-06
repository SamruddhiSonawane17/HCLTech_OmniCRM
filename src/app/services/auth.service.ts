import { Injectable } from '@angular/core';

export interface DemoUser {
  name: string;
  email: string;
}

interface StoredAccount extends DemoUser {
  salt: string;
  passwordHash: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'omnicrm-demo-session';
  private readonly accountsKey = 'omnicrm-demo-accounts';

  get currentUser(): DemoUser {
    const saved = this.sessionStorage()?.getItem(this.storageKey);
    if (saved && saved !== 'signed-in') {
      try {
        const session = JSON.parse(saved) as { name?: unknown; email?: unknown };
        if (typeof session.name === 'string' && typeof session.email === 'string') {
          const storedName = session.name.replace(/\s+/g, '').toLowerCase();
          const emailName = (session.email.split('@')[0] ?? '').replace(/[._+-]+/g, '').toLowerCase();
          return {
            name: storedName === emailName ? this.nameFromEmail(session.email) : session.name,
            email: session.email
          };
        }
      } catch (error) {
        console.error('Unable to read the local OmniCRM user profile', error);
      }
    }
    if (saved === 'signed-in') {
      return { name: 'User', email: '' };
    }
    return { name: 'Admin', email: 'admin@omnicrm.in' };
  }

  get isAuthenticated(): boolean {
    const saved = this.sessionStorage()?.getItem(this.storageKey);
    if (!saved || saved === 'signed-in') return false;
    try {
      const session = JSON.parse(saved) as { name?: unknown; email?: unknown };
      return typeof session.name === 'string' && session.name.length > 0 &&
        typeof session.email === 'string' && session.email.length > 0;
    } catch (error) {
      console.error('Unable to validate the local OmniCRM user profile', error);
      return false;
    }
  }

  signIn(rememberMe: boolean, user: DemoUser): void {
    this.signOut();
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.storageKey, JSON.stringify(user));
  }

  async createAccount(user: DemoUser, password: string, rememberMe: boolean): Promise<void> {
    const accounts = this.getAccounts();
    if (accounts.some(account => account.email === user.email)) {
      throw new Error('An account with this email already exists. Sign in instead.');
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await this.hashPassword(password, salt);
    accounts.push({
      ...user,
      salt: this.toBase64(salt),
      passwordHash
    });

    localStorage.setItem(this.accountsKey, JSON.stringify(accounts));
    this.signIn(rememberMe, user);
  }

  async authenticate(email: string, password: string): Promise<DemoUser | 'account-not-found' | 'wrong-password'> {
    const account = this.getAccounts().find(saved => saved.email === email);
    if (!account) return 'account-not-found';

    const actualHash = await this.hashPassword(password, this.fromBase64(account.salt));
    if (actualHash !== account.passwordHash) return 'wrong-password';

    return { name: account.name, email: account.email };
  }

  updateProfile(user: DemoUser): void {
    const storage = this.sessionStorage();
    if (storage?.getItem(this.storageKey) !== null && storage?.getItem(this.storageKey) !== undefined) {
      storage.setItem(this.storageKey, JSON.stringify(user));
    }
  }

  signOut(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
  }

  nameFromEmail(email: string): string {
    const localPart = (email.split('@')[0] ?? '').replace(/\d+$/, '');
    const name = localPart.replace(/[._+-]+/g, ' ').trim();
    if (!name) return 'User';
    return name.replace(/\b\w/g, character => character.toUpperCase());
  }

  private async hashPassword(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 120_000, hash: 'SHA-256' },
      key,
      256
    );
    return this.toBase64(new Uint8Array(bits));
  }

  private getAccounts(): StoredAccount[] {
    const saved = localStorage.getItem(this.accountsKey);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(account =>
      typeof account?.name === 'string' &&
      typeof account?.email === 'string' &&
      typeof account?.salt === 'string' &&
      typeof account?.passwordHash === 'string'
    )) {
      throw new Error('Saved demo accounts are invalid. Clear this browser’s OmniCRM demo data and create an account again.');
    }
    return parsed as StoredAccount[];
  }

  private toBase64(bytes: Uint8Array): string {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }

  private fromBase64(value: string): Uint8Array<ArrayBuffer> {
    const binary = atob(value);
    const bytes = new Uint8Array(new ArrayBuffer(binary.length));
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  private sessionStorage(): Storage | null {
    if (localStorage.getItem(this.storageKey) !== null) return localStorage;
    if (sessionStorage.getItem(this.storageKey) !== null) return sessionStorage;
    return null;
  }
}
