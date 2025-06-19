import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { IDataController } from './IControllers/IDataController';
import { IDataService } from '../services/IServices/IDataService';
import { dataDTO } from '../dto/dataDTO';

@injectable()
export class DataController implements IDataController {
  constructor(
    @inject('DataService') private dataService: IDataService
  ) {}

  public registerData = async (req: Request, res: Response) => {
    try {
      const data = dataDTO.parse(req.body);
      await this.dataService.registerSensorData(data);
      res.status(200).json({ message: 'Dados recebidos com sucesso' });
    } catch (error) {
      console.error('Erro ao processar os dados:', error);
      res.status(400).json({ error: 'Dados inválidos' });
    }
  };
}
