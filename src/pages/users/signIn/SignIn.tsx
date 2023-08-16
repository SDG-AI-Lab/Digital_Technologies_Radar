import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { comparePasswords, isSignedIn } from 'components/shared/helpers/auth';
import { supabase } from 'helpers/databaseClient';

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
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    const { role, password: passwordHash } = data || {};

    if (!error && comparePasswords(password, passwordHash)) {
      localStorage.setItem('drr-current-user-id', role);
      alert('Successfully Signed In');
      navigate(0);
    } else {
      alert('Incorrect credentials, please check and try again');
    }
    setLoading(false);
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
