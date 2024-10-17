import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const handleErrors = (err: any) => {
    console.log(err.message);
    let errors = { name: '' ,email: '', password: '' };
if (err.name === 'incorrect email'){
    errors.name = 'That name is not registered';
}
if (err.message === 'incorrect email') {
    errors.email = 'That email is not of admin';
};
if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
};
    return errors;
};
const maxAge = 7 * 24 * 60 * 60;
const createToken = (id: string) => {
  return jwt.sign({ id
    }, `${process.env.JWT_SECRET}`, {
        expiresIn: maxAge
    });
};

export default createToken;