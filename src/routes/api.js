/* eslint-disable import/extensions */
import express from 'express';
import AuthController from '../controllers/AuthController.js';

const route = express();

// Auth
route.post('/register', AuthController.register);
route.post('/login', AuthController.login);
route.post('/refresh-token', AuthController.refreshToken);

export default route;
