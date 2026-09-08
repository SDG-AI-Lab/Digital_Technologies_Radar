import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Register } from './Register';
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

const renderRegister = () =>
  render(
    <ChakraProvider>
      <Register />
    </ChakraProvider>
  );

describe('Register', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    mockedApiRequest.mockReset();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    (window.alert as jest.Mock).mockRestore();
  });

  it('redirects non-admins away from the register page', () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'user');

    renderRegister();

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('redirects signed-out visitors away from the register page', () => {
    renderRegister();

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('allows an admin to register a user', async () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'admin');
    mockedApiRequest.mockResolvedValue({
      user: { id: 'u1', email: 'new@example.com', role: 'user' }
    });

    renderRegister();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'new@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: 'password', value: 'long-enough-pass' }
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith('auth/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'new@example.com',
          password: 'long-enough-pass',
          role: 'user'
        })
      });
    });

    expect(window.alert).toHaveBeenCalledWith('Successfully registered user');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('registers an admin when the admin checkbox is checked', async () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'admin');
    mockedApiRequest.mockResolvedValue({
      user: { id: 'u2', email: 'admin2@example.com', role: 'admin' }
    });

    renderRegister();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'admin2@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: 'password', value: 'long-enough-pass' }
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockedApiRequest).toHaveBeenCalledWith('auth/users', {
        method: 'POST',
        body: JSON.stringify({
          email: 'admin2@example.com',
          password: 'long-enough-pass',
          role: 'admin'
        })
      });
    });
  });

  it('shows the API error message when registration fails', async () => {
    localStorage.setItem('drr-access-token', 'tok');
    localStorage.setItem('drr-current-user-id', 'admin');
    mockedApiRequest.mockRejectedValue(
      Object.assign(new Error('User already registered'), { message: 'User already registered' })
    );

    renderRegister();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { name: 'email', value: 'dup@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: 'password', value: 'long-enough-pass' }
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('User already registered');
    });
  });
});
