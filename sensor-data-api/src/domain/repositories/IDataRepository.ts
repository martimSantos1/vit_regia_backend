import { SensorData } from "../entities/sensorData";
import { Thresholds } from "../entities/thresholds";

export interface IDataRepository {
  saveSensorData(data: SensorData): Promise<void>;
  getLastSensorData(numberOfData: number, thresholds: Thresholds, range: string): Promise<SensorData[]>;
  getDataByRange(range: string, thresholds: Thresholds): Promise<SensorData[]>;
}