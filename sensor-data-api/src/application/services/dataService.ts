import { inject, injectable } from "tsyringe";
import { IDataService } from "./IServices/IDataService";
import { IDataRepository } from "../../domain/repositories/IDataRepository";
import { dataDTO, DataDTO } from "../dto/dataDTO";
import { SensorData, Status } from "../../domain/entities/sensorData";
import admin from "firebase-admin";
import { ThresholdService } from "./thresholdService";

type ParamKey =
  | "temperatureStatus"
  | "phStatus"
  | "turbidityStatus"
  | "tdsStatus"
  | "dissolvedOxygenStatus";

@injectable()
export class DataService implements IDataService {
  private lastAlertStatus: Record<ParamKey, Status> = {
    temperatureStatus: "good",
    phStatus: "good",
    turbidityStatus: "good",
    tdsStatus: "good",
    dissolvedOxygenStatus: "good",
  };

  constructor(
    @inject('DataRepository') private dataRepository: IDataRepository,
    @inject('ThresholdService') private thresholdService: ThresholdService
  ) { }

  async registerSensorData(data: DataDTO): Promise<DataDTO> {
    try {
      const thresholds = await this.thresholdService.getThresholds();

      const sensorData = new SensorData(
        data.temperature,
        data.ph,
        data.turbidity,
        data.tds,
        data.dissolvedOxygen,
        thresholds
      );

      await this.dataRepository.saveSensorData(sensorData);
      this.checkAndSendCriticalAlert(sensorData);
      return data;
    } catch (error) {
      console.error("Erro ao processar os dados:", error);
      throw new Error("Dados inválidos");
    }
  }

  async getLastSensorData(numberOfData: number): Promise<DataDTO[]> {
    try {
      if (!Number.isInteger(numberOfData) || numberOfData <= 0 || numberOfData > 100) {
        throw new Error('O parâmetro "numberOfData" deve ser um número inteiro entre 1 e 100.');
      }
      const thresholds = await this.thresholdService.getThresholds();
      const lastData = await this.dataRepository.getLastSensorData(numberOfData, thresholds);
      const dataDTOs = dataDTO.array().parse(lastData);
      return dataDTOs;
    } catch (error) {
      console.error('Erro ao obter os últimos dados:', error);
      throw new Error('Erro ao obter os últimos dados');
    }
  }

  async getDataByRange(range: string): Promise<DataDTO[]> {
    try {
      const validRanges = ['1h', '3h', '6h', '12h', '1d', '3d', '7d', '30d', '90d', '180d', '1y'];
      if (!validRanges.includes(range)) {
        throw new Error(`Intervalo inválido. Intervalos válidos: ${validRanges.join(', ')}`);
      }
      const thresholds = await this.thresholdService.getThresholds();
      const dataByRange = await this.dataRepository.getDataByRange(range, thresholds);
      const dataDTOs = dataDTO.array().parse(dataByRange);
      return dataDTOs;
    } catch (error) {
      console.error('Erro ao obter dados por intervalo:', error);
      throw new Error('Erro ao obter dados por intervalo');
    }
  }

  private async checkAndSendCriticalAlert(sensorData: SensorData): Promise<void> {
    const statusMap: Record<ParamKey, Status> = {
      temperatureStatus: sensorData.temperatureStatus,
      phStatus: sensorData.phStatus,
      turbidityStatus: sensorData.turbidityStatus,
      tdsStatus: sensorData.tdsStatus,
      dissolvedOxygenStatus: sensorData.dissolvedOxygenStatus,
    };

    const criticalParams: string[] = [];

    for (const key of Object.keys(statusMap) as ParamKey[]) {
      const currentStatus = statusMap[key];
      const previousStatus = this.lastAlertStatus[key];

      if (currentStatus === "critical" && previousStatus !== "critical") {
        criticalParams.push(this.mapParamKeyToLabel(key));
        this.lastAlertStatus[key] = "critical"; // atualizar estado
      }

      if (currentStatus !== "critical") {
        this.lastAlertStatus[key] = currentStatus; // atualizar mesmo para good ou alarming
      }
    }

    if (criticalParams.length > 0) {
      const body =
        criticalParams.length === 1
          ? `Parâmetro crítico: ${criticalParams[0]}`
          : `Parâmetros críticos: ${criticalParams.join(", ")}`;

      try {
        // 🔥 Envia a notificação via FCM
        await admin.messaging().send({
          topic: "alerts",
          notification: {
            title: "Vitória Régia - Alerta Crítico",
            body,
          },
        });

        console.log("🔔 Notificação enviada via Firebase:", body);
      } catch (error) {
        console.error("Erro ao enviar notificação Firebase:", error);
      }
    }
  }

  private mapParamKeyToLabel(key: ParamKey): string {
    switch (key) {
      case "temperatureStatus": return "Temperatura";
      case "phStatus": return "pH";
      case "turbidityStatus": return "Turbidez";
      case "tdsStatus": return "TDS";
      case "dissolvedOxygenStatus": return "Oxigénio Dissolvido";
      default: return key;
    }
  }
}
