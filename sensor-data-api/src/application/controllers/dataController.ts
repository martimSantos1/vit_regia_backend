import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { IDataController } from './IControllers/IDataController';
import { IDataService } from '../services/IServices/IDataService';
import { dataDTO } from '../dto/dataDTO';

@injectable()
export class DataController implements IDataController {
  constructor(
    @inject('DataService') private dataService: IDataService
  ) { }

  /**
   * Regista os dados do sensor.
   * @param req - Requisição HTTP contendo os dados do sensor.
   * @param res - Resposta HTTP.
   * @returns Mensagem de sucesso ou erro.
   */
  async registerData(req: Request, res: Response): Promise<Response> {
    try {
      const data = dataDTO.parse(req.body);
      await this.dataService.registerSensorData(data);
      return res.status(200).json({ message: 'Dados recebidos com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
  }

  /**
   * Obtém os últimos dados do sensor.
   * @param req - Requisição HTTP.
   * @param res - Resposta HTTP.
   * @returns Últimos dados do sensor.
   */
  async getLastData(req: Request, res: Response): Promise<Response> {
    try {
      const { numberOfData } = req.query;
      const numberOfLastData = parseInt(numberOfData as string, 10) || 1;

      const lastData = await this.dataService.getLastSensorData(numberOfLastData);

      if (lastData.length === 0) {
        return res.status(404).json({ message: 'Nenhum dado encontrado.' });
      }

      const responseMessage = `Últimos ${numberOfLastData} dados recebidos com sucesso`;
      return res.status(200).json({ message: responseMessage, data: lastData });

    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro interno no servidor' });
    }
  }
}
