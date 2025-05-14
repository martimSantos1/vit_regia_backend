import { Request, Response } from "express";

export interface IRoleController {
    create(req: Request, res: Response): Promise<Response>;
    getAll(req: Request, res: Response): Promise<Response>;
}