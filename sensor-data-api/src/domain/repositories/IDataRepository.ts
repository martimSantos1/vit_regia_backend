import { SensorData } from "../entities/sensorData";

export interface IDataRepository {
  saveSensorData(data: SensorData): Promise<void>;
}