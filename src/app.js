/* eslint-disable import/extensions */
import express from 'express';
import dotenv from 'dotenv';
import connection from './config/database.js';
import apiRoute from './routes/api.js';

const env = dotenv.config().parsed;

const app = express();

app.use(express.json());

app.use('/', apiRoute);

app.use((req, res) => {
  res.status(404).json({ message: '404_NOT_FOUND' });
});

connection();

app.listen(env.APP_PORT, env.APP_HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://${env.APP_HOST}:${env.APP_PORT}`);
});
