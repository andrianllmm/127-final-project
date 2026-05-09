import app from './app.js';
import { env } from './config/env.js';
import { initPool } from './db/pool.js';

await initPool();

const server = app.listen(env.PORT, env.HOST, () => {
  const address = server.address();

  if (typeof address === 'object' && address) {
    const host = env.HOST === '0.0.0.0' ? 'localhost' : env.HOST;

    console.log(`Server running on http://${host}:${address.port}`);
  } else {
    console.log(`Server running on port ${env.PORT}`);
  }
});
