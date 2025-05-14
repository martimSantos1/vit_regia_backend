import { Application } from 'express';
import { Server as HttpServer } from 'http';
import expressLoader from './express';
import socketLoader from './socket';

export default async ({
    expressApp,
    httpServer,
}: {
    expressApp: Application;
    httpServer: HttpServer;
}) => {
    await expressLoader({ app: expressApp });
    console.log('Express carregado');

    await socketLoader({ server: httpServer });
    console.log('Socket.IO carregado');

    console.log('Loaders initialized.');
};
