import { clearSession, isAdmin, isSignedIn } from './auth';

describe('auth helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reports signed out when no access token is stored', () => {
    expect(isSignedIn()).toBe(false);
    expect(isAdmin()).toBe(false);
  });

  it('reports signed out for an empty token string', () => {
    localStorage.setItem('drr-access-token', '');
    expect(isSignedIn()).toBe(false);
    expect(isAdmin()).toBe(false);
  });

  it('reports signed in when an access token is present', () => {
    localStorage.setItem('drr-access-token', 'tok');
    expect(isSignedIn()).toBe(true);
    expect(isAdmin()).toBe(false);
  });

  it('reports admin only when token and admin user id are present', () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'admin');
    expect(isSignedIn()).toBe(true);
    expect(isAdmin()).toBe(true);
  });

  it('does not treat a non-admin user id as admin', () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'user-123');
    expect(isAdmin()).toBe(false);
  });

  it('does not treat admin id alone as admin without a token', () => {
    localStorage.setItem('drr-current-user-id', 'admin');
    expect(isSignedIn()).toBe(false);
    expect(isAdmin()).toBe(false);
  });

  it('clears the session keys', () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'admin');
    localStorage.setItem('drr-technologies', 'keep-me');

    clearSession();

    expect(localStorage.getItem('drr-access-token')).toBeNull();
    expect(localStorage.getItem('drr-current-user-id')).toBeNull();
    expect(localStorage.getItem('drr-technologies')).toBe('keep-me');
    expect(isSignedIn()).toBe(false);
    expect(isAdmin()).toBe(false);
  });

  it('is idempotent when clearing an already empty session', () => {
    clearSession();
    expect(isSignedIn()).toBe(false);
    expect(isAdmin()).toBe(false);
  });
});
