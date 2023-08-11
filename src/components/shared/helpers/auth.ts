import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { Buffer } from 'buffer/';

// export const createJWT = (email: string, role = 'user'): string => {
//   const token = jwt.sign(
//     {
//       email,
//       role,
//       exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // set to expire after 30 days!!
//     },
//     process.env.REACT_APP_JWT_SECRET as unknown as string
//   );
//   return token;
// };

export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 5);
};
