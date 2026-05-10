import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth } from './auth/auth.js';

import usersRoutes from './modules/users/users.routes.js';

const app = express();

app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
  }),
);

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

app.get('/api/me', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.use('/users', usersRoutes);

export default app;
