import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth } from './modules/auth/auth.config.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({
    name: 'MiaGo API',
    version: '1.0.0',
    status: 'running',
    docs: '/docs',
  });
});

app.get('/api/me', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
  });
});

app.use('/users', usersRoutes);

export default app;
