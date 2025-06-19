import { DataDTO } from "../../dto/dataDTO";

export interface IDataService {
  registerSensorData(data: DataDTO): Promise<DataDTO>;
  getLastSensorData(numberOfData: number): Promise<DataDTO[]>;
  getDataByRange(range: string): Promise<DataDTO[]>;
}
