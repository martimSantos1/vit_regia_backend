import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import loaders from './loaders';

async function startServer() {
  dotenv.config();
  const app = express();
  const server = http.createServer(app);

  await loaders({ expressApp: app, httpServer: server });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`
    ##########################################
       🛡️  Server listening on port: ${port} 🛡️ 
    ##########################################
  `);
  });

}

startServer();
