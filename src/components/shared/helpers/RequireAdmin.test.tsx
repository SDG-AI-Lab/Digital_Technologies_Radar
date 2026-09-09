import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { RequireAdmin } from './RequireAdmin';
import { setSession, clearSession } from './auth';

describe('RequireAdmin', () => {
  beforeEach(() => {
    clearSession();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('redirects anonymous users to sign-in', () => {
    render(
      <MemoryRouter initialEntries={['/projects/review']}>
        <Routes>
          <Route
            path='/projects/review'
            element={
              <RequireAdmin>
                <div>secret</div>
              </RequireAdmin>
            }
          />
          <Route path='/sign-in' element={<div>sign-in</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('sign-in')).toBeInTheDocument();
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });

  it('renders children for admins', () => {
    setSession('tok', 'admin');

    render(
      <MemoryRouter initialEntries={['/projects/review']}>
        <Routes>
          <Route
            path='/projects/review'
            element={
              <RequireAdmin>
                <div>secret</div>
              </RequireAdmin>
            }
          />
          <Route path='/sign-in' element={<div>sign-in</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('secret')).toBeInTheDocument();
  });
});
