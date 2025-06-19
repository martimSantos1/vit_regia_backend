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
      const lastData = await this.dataRepository.getLastSensorData(numberOfData);
      const dataDTOs = dataDTO.array().parse(lastData);
      return dataDTOs;
    } catch (error) {
      console.error('Erro ao obter os últimos dados:', error);
      throw new Error('Erro ao obter os últimos dados');
    }
  }
}
