import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Spinner
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { hashPassword, isAdmin } from 'components/shared/helpers/auth';
import { supabase } from 'helpers/databaseClient';

import './Register.scss';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
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

  const handleRegister = async (): Promise<void> => {
    setLoading(true);
    const payload = {
      email,
      password: hashPassword(password),
      role
    };
    const { error } = await supabase.from('users').insert(payload as any);
    if (!error) {
      alert('Successfully registered user');
      navigate('/');
    } else {
      alert('There was an error, please try again');
    }
    setLoading(false);
  };

  return (
    <div className='signIn'>
      <h3>Register</h3>
      <FormControl display={'flex'} gap={3} mb={5}>
        <FormLabel w={110}>Email:</FormLabel>
        <Input type='email' name='email' onChange={handleChange} />
      </FormControl>
      <FormControl display={'flex'} gap={3} mb={5}>
        <FormLabel w={110}>Password:</FormLabel>
        <Input type='password' name='password' onChange={handleChange} />
      </FormControl>
      <FormControl display={'flex'} gap={3} mb={5}>
        <FormLabel w={85}>Admin:</FormLabel>
        <Checkbox
          onChange={(e: any) => {
            setRole(`${e.target.checked ? 'admin' : 'user'}`);
          }}
        />
      </FormControl>

      <div className='submit'>
        {loading ? (
          <Spinner />
        ) : (
          <Button
            p={'10px 30px'}
            onClick={() => {
              void handleRegister();
            }}
          >
            Register
          </Button>
        )}
      </div>
    </div>
  );
};
