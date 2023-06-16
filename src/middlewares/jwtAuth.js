/* eslint-disable no-throw-literal */
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

// eslint-disable-next-line consistent-return
const jwtAuth = () => async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw { code: 401, message: 'UNAUTHORIZED' };
    }
    // bearer token
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, env.JWT_ACCESS_TOKEN_SECRET);

    req.jwt = verify;

    // continue to other middleware if exist or controller
    next();
  } catch (error) {
    const errorJwt = ['invalid signature', 'jwt malformed',
      'jwt must be provided', 'invalid token'];
    if (error.message === 'jwt expired') {
      error.code = 401; // code expired or unauthorized
      error.message = 'ACCESS_TOKEN_EXPIRED';
    } else if (errorJwt.includes(error.message)) {
      error.message = 'INVALID_ACCESS_TOKEN';
    }

    return res.status(error.code || 500).json({
      status: false,
      message: error.message,
    });
  }
};

export default jwtAuth;
