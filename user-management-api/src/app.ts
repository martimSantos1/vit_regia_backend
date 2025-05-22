import 'reflect-metadata'; // We need this in order to use @Decorators
import config from './config';
import express from 'express';
import loaders from './loaders/index';

async function startServer() {
    const app = express();

    await loaders({ expressApp: app });

    app.listen(config.port, () => {

        console.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
    })
}

startServer();