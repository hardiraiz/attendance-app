/* eslint-disable import/extensions */
import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.js';
import AuthController from '../controllers/AuthController.js';
import AttendanceController from '../controllers/AttendanceController.js';

const route = express();

// Auth
route.post('/register', AuthController.register);
route.post('/login', AuthController.login);
route.post('/refresh-token', AuthController.refreshToken);

// Attendance
route.get('/attendance', jwtAuth(), AttendanceController.index);
route.post('/attendance', jwtAuth(), AttendanceController.store);
route.put('/attendance/:id', jwtAuth(), AttendanceController.update);

// Permit
route.get('/permit', jwtAuth());
route.get('/permit/user/:id', jwtAuth());
route.put('/permit/user/:id', jwtAuth());

export default route;
