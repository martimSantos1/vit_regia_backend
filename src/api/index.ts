import { Router } from "express";
import role from './routes/roleRoute';
import user from './routes/userRoute';

export default () => {
    const app = Router();
    role(app);
    user(app);
    return app;
}