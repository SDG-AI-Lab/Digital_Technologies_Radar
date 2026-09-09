import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin } from './auth';
import { ROUTES } from 'navigation/routes';

/**
 * Route guard for admin-only screens. Authorization is still enforced by the
 * API; this only keeps the UI from rendering protected forms.
 */
export const RequireAdmin: React.FC = ({ children }) => {
  const location = useLocation();

  if (!isAdmin()) {
    return (
      <Navigate
        to={`/${ROUTES.SIGN_IN}`}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};
