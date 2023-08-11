import bcrypt from 'bcryptjs';

export const comparePasswords = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

export const hashPassword = (password: string): any => {
  const hash = bcrypt.hashSync(password, 5);
  return hash;
};

export const isAdmin = localStorage.getItem('drr-current-user-id') === 'admin';

export const isSignedIn = !!localStorage.getItem('drr-current-user-id');
