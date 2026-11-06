import { AuthService } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    auth = new AuthService();
  });

  it('stores a password hash and authenticates only the matching password', async () => {
    await auth.createAccount({ name: 'Taylor Example', email: 'taylor@example.com' }, 'correct-horse', true);

    const savedAccounts = localStorage.getItem('omnicrm-demo-accounts');
    expect(savedAccounts).not.toContain('correct-horse');
    expect(await auth.authenticate('taylor@example.com', 'incorrect-password')).toBe('wrong-password');
    expect(await auth.authenticate('taylor@example.com', 'wrong')).toBe('wrong-password');
    expect(await auth.authenticate('taylor@example.com', 'correct-horse')).toEqual({
      name: 'Taylor Example',
      email: 'taylor@example.com'
    });
  });

  it('rejects duplicate email addresses', async () => {
    const user = { name: 'Taylor Example', email: 'taylor@example.com' };
    await auth.createAccount(user, 'correct-horse', true);

    await expect(auth.createAccount(user, 'another-password', true))
      .rejects.toThrow('An account with this email already exists.');
  });

  it('reports when an email has no account', async () => {
    expect(await auth.authenticate('missing@example.com', 'any-password')).toBe('account-not-found');
  });
});
