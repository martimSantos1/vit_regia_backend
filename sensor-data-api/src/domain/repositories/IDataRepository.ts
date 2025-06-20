import { SensorData } from "../entities/sensorData";

export interface IDataRepository {
  saveSensorData(data: SensorData): Promise<void>;
  getLastSensorData(numberOfData: number): Promise<SensorData[]>;
  getDataByRange(range: string): Promise<SensorData[]>;
}