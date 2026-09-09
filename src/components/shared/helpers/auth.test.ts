import {
  clearSession,
  getAccessToken,
  isAdmin,
  isSignedIn,
  setSession
} from './auth';

describe('auth helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('reports signed out when no access token is stored', () => {
    expect(isSignedIn()).toBe(false);
    expect(isAdmin()).toBe(false);
  });

  it('reports signed out for an empty token string', () => {
    sessionStorage.setItem('drr-access-token', '');
    expect(isSignedIn()).toBe(false);
    expect(isAdmin()).toBe(false);
  });

  it('reports signed in when an access token is present', () => {
    setSession('tok', 'user');
    expect(isSignedIn()).toBe(true);
    expect(isAdmin()).toBe(false);
    expect(getAccessToken()).toBe('tok');
  });

  it('reports admin only when token and admin role are present', () => {
    setSession('tok', 'admin');
    expect(isSignedIn()).toBe(true);
    expect(isAdmin()).toBe(true);
  });

  it('does not treat a non-admin role as admin', () => {
    setSession('tok', 'user-123');
    expect(isAdmin()).toBe(false);
  });

  it('does not treat admin role alone as admin without a token', () => {
    sessionStorage.setItem('drr-current-user-id', 'admin');
    expect(isSignedIn()).toBe(false);
    expect(isAdmin()).toBe(false);
  });

  it('migrates legacy localStorage tokens into sessionStorage', () => {
    localStorage.setItem('drr-access-token', 'legacy-tok');
    localStorage.setItem('drr-current-user-id', 'admin');

    expect(isAdmin()).toBe(true);
    expect(sessionStorage.getItem('drr-access-token')).toBe('legacy-tok');
    expect(localStorage.getItem('drr-access-token')).toBeNull();
  });

  it('clears the session keys from both storages', () => {
    setSession('tok', 'admin');
    localStorage.setItem('drr-technologies', 'keep-me');

    clearSession();

    expect(sessionStorage.getItem('drr-access-token')).toBeNull();
    expect(sessionStorage.getItem('drr-current-user-id')).toBeNull();
    expect(localStorage.getItem('drr-access-token')).toBeNull();
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
