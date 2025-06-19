import { Request, Response } from 'express';

export interface IDataController {
  registerData(req: Request, res: Response): Promise<void>;
}