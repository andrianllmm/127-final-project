import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';

import usersRoutes from './modules/users/users.routes.js';

const app = express();

app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

app.use('/users', usersRoutes);

export default app;
