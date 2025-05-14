import { Request, Response } from 'express';
import { z } from 'zod';
import { DataService } from '../services/dataService';

export class DataController {
  private dataService = new DataService();

  private dataSchema = z.object({
    temp: z.number().min(-50).max(100),
    ph: z.number().min(0).max(100),
  });

  public receiveData = async (req: Request, res: Response) => {
    try {
      const data = this.dataSchema.parse(req.body);
      this.dataService.processSensorData(data);
      res.status(200).json({ message: 'Dados recebidos com sucesso' });
    } catch (error) {
      console.error('Erro ao processar os dados:', error);
      res.status(400).json({ error: 'Dados inválidos' });
    }
  };
}
