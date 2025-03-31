import 'reflect-metadata'; // We need this in order to use @Decorators
import config from './config.js';
import express from 'express';
import loaders from './loaders/index.js';
import Logger from './loaders/logger.js';

async function startServer() {
  const app = express();

  
  await loaders({ expressApp: app });


  app.listen(config.port, () => {

    console.log("Server listening on port: " + config.port);

    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
  })
    .on('error', (err) => {
      Logger.error(err);
      process.exit(1);
      return;
    });
}

startServer();