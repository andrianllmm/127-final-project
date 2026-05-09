import app from './app.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  const address = server.address();

  if (typeof address === 'object' && address) {
    console.log(
      `Server running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${address.port}`,
    );
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});
