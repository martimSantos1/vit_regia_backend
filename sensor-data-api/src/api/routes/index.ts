import { Router } from "express";
import data from './dataRoute';

export default () => {
    const app = Router();
    data(app);
    return app;
}