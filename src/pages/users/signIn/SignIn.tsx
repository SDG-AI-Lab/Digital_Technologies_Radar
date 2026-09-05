import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { isSignedIn } from 'components/shared/helpers/auth';
import { apiRequest } from 'helpers/apiClient';

import './SignIn.scss';

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/');
    }
  }, []);

  const handleChange = (e: any): void => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSignIn = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await apiRequest<{
        access_token: string;
        user: { role: 'admin' | 'user' };
      }>('auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('drr-access-token', data.access_token);
      localStorage.setItem('drr-current-user-id', data.user.role);
      alert('Successfully Signed In');
      navigate(0);
    } catch {
      alert('Incorrect credentials, please check and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signIn'>
      <h3>Sign In</h3>
      <FormControl display={'flex'} gap={3} mb={5}>
        <FormLabel w={110}>Email:</FormLabel>
        <Input type='email' name='email' onChange={handleChange} />
      </FormControl>
      <FormControl display={'flex'} gap={3} mb={5}>
        <FormLabel w={110}>Password:</FormLabel>
        <Input type='password' name='password' onChange={handleChange} />
      </FormControl>

      <div className='submit'>
        {loading ? (
          <Spinner />
        ) : (
          <Button
            p={'10px 30px'}
            onClick={() => {
              void handleSignIn();
            }}
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};
