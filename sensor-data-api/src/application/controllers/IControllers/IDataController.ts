import { Request, Response } from 'express';

export interface IDataController {
  receiveData(req: Request, res: Response): Promise<void>;
}