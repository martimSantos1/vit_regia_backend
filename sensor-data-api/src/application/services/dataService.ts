import { inject, injectable } from "tsyringe";
import { IDataService } from "./IServices/IDataService";
import { IDataRepository } from "../../domain/repositories/IDataRepository";
import { SensorData } from "../../domain/entities/sensorData";


@injectable()
export class DataService implements IDataService {
  constructor(
    @inject('DataRepository') private dataRepository: IDataRepository
  ){}

  public registerSensorData(data: SensorData): void {
    console.log('Processando dados no serviço:', data);


    // Futuro: Guardar no InfluxDB aqui
  }
}
