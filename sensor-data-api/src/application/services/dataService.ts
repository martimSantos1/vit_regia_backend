import { inject, injectable } from "tsyringe";
import { IDataService } from "./IServices/IDataService";
import { IDataRepository } from "../../domain/repositories/IDataRepository";
import { dataDTO, DataDTO } from "../dto/dataDTO";
import { SensorData } from "../../domain/entities/sensorData";


@injectable()
export class DataService implements IDataService {
  constructor(
    @inject('DataRepository') private dataRepository: IDataRepository
  ) { }

  async registerSensorData(data: DataDTO): Promise<DataDTO> {
    try {
      const sensorData = new SensorData(
        data.temperature,
        data.ph,
        data.turbidity,
        data.tds,
        data.conductivity,
        data.dissolvedOxygen
      );
      this.dataRepository.saveSensorData(sensorData);
    } catch (error) {
      console.error('Erro ao processar os dados:', error);
      throw new Error('Dados inválidos');
    }
    return Promise.resolve(data);
  }

  async getLastSensorData(numberOfData: number): Promise<DataDTO[]> {
    try {
      if (!Number.isInteger(numberOfData) || numberOfData <= 0 || numberOfData > 100) {
        throw new Error('O parâmetro "numberOfData" deve ser um número inteiro entre 1 e 100.');
      }

      const lastData = await this.dataRepository.getLastSensorData(numberOfData);
      const dataDTOs = dataDTO.array().parse(lastData);
      return dataDTOs;
    } catch (error) {
      console.error('Erro ao obter os últimos dados:', error);
      throw new Error('Erro ao obter os últimos dados');
    }
  }

  async getDataByRange(range: string): Promise<DataDTO[]> {
    try {
      const validRanges = ['1h', '3h', '6h', '12h', '1d', '3d', '7d', '30d', '90d', '180d', '1y'];
      if (!validRanges.includes(range)) {
        throw new Error(`Intervalo inválido. Intervalos válidos: ${validRanges.join(', ')}`);
      }
      const dataByRange = await this.dataRepository.getDataByRange(range);
      const dataDTOs = dataDTO.array().parse(dataByRange);
      return dataDTOs;
    } catch (error) {
      console.error('Erro ao obter dados por intervalo:', error);
      throw new Error('Erro ao obter dados por intervalo');
    }
  }
}
