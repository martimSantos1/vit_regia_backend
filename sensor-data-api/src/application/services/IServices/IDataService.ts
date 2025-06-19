import { DataDTO } from "../../dto/dataDTO";

export interface IDataService {
  registerSensorData(data: DataDTO): Promise<DataDTO>;
}
