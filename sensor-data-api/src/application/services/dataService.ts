import { inject, injectable } from "tsyringe";
import { IDataService } from "./IServices/IDataService";
import { IDataRepository } from "../../domain/repositories/IDataRepository";
import { DataDTO } from "../dto/dataDTO";
import { SensorData } from "../../domain/entities/sensorData";


@injectable()
export class DataService implements IDataService {
  constructor(
    @inject('DataRepository') private dataRepository: IDataRepository
  ) { }

  public registerSensorData(data: DataDTO): Promise<DataDTO> {
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
}
