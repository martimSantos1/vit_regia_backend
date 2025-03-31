import { Router } from 'express';
import user from './routes/userRoute.js';
import role from './routes/roleRoute.js';

export default () => {
    const app = Router();
    // here we define our routes
    role(app);
    return app
}