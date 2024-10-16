import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const maxAge = 7 * 24 * 60 * 60;
const createToken = (id: string) => {
  return jwt.sign({ id
    }, `${process.env.JWT_SECRET}`, {
        expiresIn: maxAge
    });
};

export default createToken;