import { Request, Response } from "express";

export interface IUserController {
    login(req: Request, res: Response): Promise<Response>;
    create(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
    getAll(req: Request, res: Response): Promise<Response>;
    getById(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
}