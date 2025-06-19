import { Request, Response } from 'express';

export interface IDataController {
  registerData(req: Request, res: Response): Promise<Response>;
  getLastData(req: Request, res: Response): Promise<Response>;
}