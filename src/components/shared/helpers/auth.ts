// These helpers control the browser UI only. Netlify verifies the access token
// and role again before every protected API operation.
//
// Tokens live in sessionStorage (not localStorage) so they do not persist across
// browser restarts and are less exposed to long-lived XSS. Legacy localStorage
// values are migrated once, then removed.

const TOKEN_KEY = 'drr-access-token';
const ROLE_KEY = 'drr-current-user-id';

const readSessionValue = (key: string): string | null => {
  const fromSession = sessionStorage.getItem(key);
  if (fromSession !== null) {
    return fromSession;
  }

  const fromLocal = localStorage.getItem(key);
  if (fromLocal !== null) {
    sessionStorage.setItem(key, fromLocal);
    localStorage.removeItem(key);
    return fromLocal;
  }

  return null;
};

export const getAccessToken = (): string | null => {
  const token = readSessionValue(TOKEN_KEY);
  return token || null;
};

export const getUserRole = (): string | null => readSessionValue(ROLE_KEY);

export const setSession = (token: string, role: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY, role);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const isSignedIn = (): boolean => !!getAccessToken();

export const isAdmin = (): boolean => isSignedIn() && getUserRole() === 'admin';

export const clearSession = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};
