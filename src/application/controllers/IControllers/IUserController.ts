// src/interfaces/IRoleController.ts
import { Request, Response } from 'express';

export default interface IUserController {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    // updateUserName(req: Request, res: Response): Promise<void>;
}