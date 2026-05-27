import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
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
const uploadsDir = join(process.cwd(), 'uploads');

mkdirSync(uploadsDir, { recursive: true });

const allowedWebOrigins = [env.WEB_URL];

if (env.WEB_URL.startsWith('http://localhost:') || env.WEB_URL.startsWith('https://localhost:')) {
  const url = new URL(env.WEB_URL);
  allowedWebOrigins.push(`${url.protocol}//127.0.0.1:${url.port}`);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedWebOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

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
app.use('/items', storeItemsRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/orders', ordersRoutes);
app.use('/deliveries', deliveriesRoutes);

app.use(
  (error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Image must be 5MB or smaller' });
      }

      return res.status(400).json({ message: error.message });
    }

    if (error instanceof Error) {
      console.error(error);
      return res.status(500).json({ message: error.message || 'Internal server error' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  },
);

export default app;
