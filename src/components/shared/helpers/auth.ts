// These values control the browser UI only. Netlify verifies the access token
// and role again before every protected API operation.
export const isSignedIn = !!localStorage.getItem('drr-access-token');

export const isAdmin =
  isSignedIn && localStorage.getItem('drr-current-user-id') === 'admin';

export const clearSession = (): void => {
  localStorage.removeItem('drr-current-user-id');
  localStorage.removeItem('drr-access-token');
};
