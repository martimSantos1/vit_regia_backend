import { Router } from "express";
import role from './routes/roleRoute';

export default () => {
    const app = Router();
    role(app);
    return app;
}