import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import methodOverride from 'method-override';
import routes from '../routes/index';

export default ({ app }: { app: express.Application }) => {
    /**
     * Health Check endpoints
     * @TODO Explain why they are here
     */
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');

    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());


    app.use(methodOverride());


    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json());



    // Load API routes
    app.use('/api', routes());



    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err: Error & { status?: number } = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers
    // Middleware para tratar erros 401 (UnauthorizedError)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
        res.status(err.status || 401).send({ message: err.message }).end();
        return;
    }
    next(err); // Certifique-se de chamar `next` para passar o erro para o próximo middleware
});

// Middleware genérico para tratar outros erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
    res.status(err.status || 500).json({
        errors: {
            message: err.message,
        },
    });
});
};