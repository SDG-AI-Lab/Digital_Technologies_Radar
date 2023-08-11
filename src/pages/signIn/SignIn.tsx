import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { hashPassword } from 'components/shared/helpers/auth';

import './SignIn.scss';

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleChange = (e): void => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleSignIn = () => {};

  const handleRegister = (): void => {
    // const hashedPassword = hashPassword(password);
    // console.log({ hashedPassword });
  };

  return (
    <div className='signIn'>
      <h3>Sign In</h3>
      <FormControl display={'flex'} gap={3} mb={5}>
        <FormLabel w={110}>Email:</FormLabel>
        <Input
          type='email'
          name='email'
          // value=''
          onChange={handleChange}
        />
      </FormControl>
      <FormControl display={'flex'} gap={3} mb={5}>
        <FormLabel w={110}>Password:</FormLabel>
        <Input
          type='password'
          name='password'
          // value=''
          onChange={handleChange}
        />
      </FormControl>

      <div className='submit'>
        <Button p={'10px 30px'} onClick={handleSignIn}>
          Sign In
        </Button>

        <Button p={'10px 30px'} onClick={handleRegister}>
          Register
        </Button>
      </div>
    </div>
  );
};
