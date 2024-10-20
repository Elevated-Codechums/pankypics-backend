import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const maxAge = 7 * 24 * 60 * 60;

export const createToken = (id: string) => {
    return jwt.sign({ id
      }, `${process.env.JWT_SECRET}`, {
          expiresIn: maxAge
      });
  };


// TODO: Check if the function verifyToken is needed or not (Rishit Jain)
export const verifyToken = (token: string) => {
    return jwt.verify(token, `${process.env.JWT_SECRET}`);
    };