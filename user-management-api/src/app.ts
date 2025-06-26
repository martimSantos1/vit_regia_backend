import 'reflect-metadata';
import config from './config';
import express from 'express';
import loaders from './loaders/index';
import https from 'https';
import fs from 'fs';

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  // Lê os certificados SSL gerados com mkcert (ou outro)
  const key = fs.readFileSync('./cert/192.168.0.104-key.pem');
  const cert = fs.readFileSync('./cert/192.168.0.104.pem');

  const httpsServer = https.createServer({ key, cert }, app);

  httpsServer.listen(config.port, () => {
    console.info(`
      ################################################
      🛡️  HTTPS Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
  });
}

startServer();