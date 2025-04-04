import { NextFunction, Request, Response } from 'express';

export default interface IRoleController {
    createRole(req: Request, res: Response, next: NextFunction): Promise<void>;
}