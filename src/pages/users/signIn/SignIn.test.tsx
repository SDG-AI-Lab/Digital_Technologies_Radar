import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { SignIn } from './SignIn';
import { apiRequest } from 'helpers/apiClient';

jest.mock('helpers/apiClient', () => ({
  apiRequest: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

const renderSignIn = () =>
  render(
    <ChakraProvider>
      <SignIn />
    </ChakraProvider>
  );

describe('SignIn', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    mockedApiRequest.mockReset();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore();
  });

  it('redirects home when already signed in', () => {
    localStorage.setItem('drr-access-token', 'existing-token');

    renderSignIn();

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders the sign-in form when signed out', () => {
    renderSignIn();

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('stores the session and reloads on successful sign-in', async () => {
    mockedApiRequest.mockResolvedValue({
      access_token: 'new-token',
      user: { role: 'admin' }
    });

    renderSignIn();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'admin@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: 'password', value: 'secret-password' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith('auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'secret-password'
        })
      });
    });

    expect(localStorage.getItem('drr-access-token')).toBe('new-token');
    expect(localStorage.getItem('drr-current-user-id')).toBe('admin');
    expect(window.alert).toHaveBeenCalledWith('Successfully Signed In');
    expect(mockNavigate).toHaveBeenCalledWith(0);
  });

  it('alerts on incorrect credentials and does not store a session', async () => {
    mockedApiRequest.mockRejectedValue(new Error('Unauthorized'));

    renderSignIn();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: 'password', value: 'wrong' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Incorrect credentials, please check and try again'
      );
    });

    expect(localStorage.getItem('drr-access-token')).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalledWith(0);
  });
});
