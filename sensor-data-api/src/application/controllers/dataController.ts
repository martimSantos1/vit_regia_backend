import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { IDataController } from './IControllers/IDataController';
import { IDataService } from '../services/IServices/IDataService';
import { dataDTO, DataDTO } from '../dto/dataDTO';

@injectable()
export class DataController implements IDataController {
  constructor(
    @inject('DataService') private dataService: IDataService
  ) {}

  public receiveData = async (req: Request, res: Response) => {
    try {
      const data = dataDTO.parse(req.body);
      await this.dataService.processSensorData(data);
      res.status(200).json({ message: 'Dados recebidos com sucesso' });
    } catch (error) {
      console.error('Erro ao processar os dados:', error);
      res.status(400).json({ error: 'Dados inválidos' });
    }
  };
}
