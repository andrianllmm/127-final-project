import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './modules/auth/auth.config.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

import usersRoutes from './modules/users/users.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import storesRoutes from './modules/stores/stores.routes.js';
import storeItemsRoutes from './modules/store-items/store-items.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import deliveriesRoutes from './modules/deliveries/deliveries.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';

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
app.use('/stores', storesRoutes);
app.use('/stores', storeItemsRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/orders', ordersRoutes);
app.use('/deliveries', deliveriesRoutes);

export default app;
