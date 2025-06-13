import { SensorData } from "../../../domain/entities/sensorData";

export interface IDataService {
  processSensorData(data: SensorData): void;
}
