import { injectable } from 'tsyringe';
import { IDataRepository } from '../../domain/repositories/IDataRepository';
import { SensorData } from '../../domain/entities/sensorData';

import { Point } from '@influxdata/influxdb-client';
import { getWriteApi } from '../../loaders/influx';
import { write } from 'fs';

@injectable()
export class DataRepository implements IDataRepository {
  async saveSensorData(data: SensorData): Promise<void> {
    const writeApi = getWriteApi(); // obtém a instância do WriteApi

    const point = new Point('sensor_data') // nome da "measurement"
      .floatField('temperature', data.temperature)
      .floatField('ph', data.ph)
      .floatField('turbidity', data.turbidity)
      .floatField('tds', data.tds)
      .floatField('conductivity', data.conductivity)
      .floatField('dissolved_oxygen', data.dissolvedOxygen)
      .timestamp(new Date());

    writeApi.writePoint(point);

    try {
      await writeApi.close(); // garante que os dados são enviados
    } catch (error) {
      console.error('Erro ao gravar dados no InfluxDB:', error);
    }
  }
}
