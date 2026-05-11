import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './modules/auth/auth.config.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

import usersRoutes from './modules/users/users.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import storeRoutes from './modules/store/store.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import riderRoutes from './modules/rider/rider.routes.js';

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

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
  });
});

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/stores', storeRoutes);
app.use('/orders', orderRoutes);
app.use('/rider', riderRoutes);

export default app;
