import { injectable } from 'tsyringe';
import { IDataRepository } from '../../domain/repositories/IDataRepository';
import { SensorData } from '../../domain/entities/sensorData';


@injectable()
export class DataRepository implements IDataRepository {
  async saveSensorData(data: SensorData): Promise<void> {
    console.log('Salvando no repositório (mock):', data);
    // Aqui no futuro: lógica para gravar no InfluxDB
  }
}