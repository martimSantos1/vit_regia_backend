import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export default ({ server }: { server: HttpServer }): Server => {
    io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('Frontend conectado via WebSocket:', socket.id);

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });

    return io;
};

export { io };
