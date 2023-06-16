/* eslint-disable import/extensions */
import express from 'express';
import jwtAuth from '../middlewares/jwtAuth.js';
import AuthController from '../controllers/AuthController.js';
import AttendanceController from '../controllers/AttendanceController.js';
import PermitController from '../controllers/PermitController.js';
import UserController from '../controllers/UserController.js';

const route = express();

// Auth
route.post('/register', AuthController.register);
route.post('/login', AuthController.login);
route.post('/refresh-token', AuthController.refreshToken);

// User
route.get('/users', jwtAuth(), UserController.index);

// Attendance
route.get('/user/attendance', jwtAuth(), AttendanceController.index);
route.get('/user/:id/attendance', jwtAuth(), AttendanceController.show);
route.post('/user/attendance', jwtAuth(), AttendanceController.store);
route.put('/user/attendance/:id', jwtAuth(), AttendanceController.update);

// Permit
route.get('/permit', jwtAuth(), PermitController.listPermits);
route.get('/user/permit', jwtAuth(), PermitController.listUserPermits);
route.get('/user/permit/:id', jwtAuth(), PermitController.showUserPermits);
route.post('/user/permit', jwtAuth(), PermitController.store);
route.put('/user/:id/permit/:permitId', jwtAuth(), PermitController.update);

// Report
route.get('/reports', jwtAuth());

export default route;
