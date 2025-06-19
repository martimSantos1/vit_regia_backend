import { SensorData } from "../../../domain/entities/sensorData";

export interface IDataService {
  registerSensorData(data: SensorData): void;
}
