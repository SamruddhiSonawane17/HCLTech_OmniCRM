import { signal } from '@angular/core';

export class PersistedList<T extends { id: string }> {
  readonly items;

  constructor(private readonly storageKey: string, initial: T[]) {
    let saved: T[] | null = null;
    try {
      const raw = localStorage.getItem(storageKey);
      saved = raw ? JSON.parse(raw) as T[] : null;
    } catch (error) {
      console.error(`Unable to load ${storageKey} from local storage`, error);
    }
    this.items = signal<T[]>(saved ?? initial);
  }

  add(item: T): void { this.commit([...this.items(), item]); }
  update(item: T): void { this.commit(this.items().map(current => current.id === item.id ? item : current)); }
  remove(id: string): void { this.commit(this.items().filter(item => item.id !== id)); }

  private commit(items: T[]): void {
    this.items.set(items);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error(`Unable to save ${this.storageKey} to local storage`, error);
    }
  }
}
