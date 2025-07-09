import "reflect-metadata";
import { injectable } from 'tsyringe';
import { IDataRepository } from '../../domain/repositories/IDataRepository';
import { SensorData } from '../../domain/entities/sensorData';

import { Point, flux } from '@influxdata/influxdb-client';
import { getWriteApi, getQueryApi } from '../../loaders/influx';
import { Thresholds } from '../../domain/entities/thresholds';

@injectable()
export class DataRepository implements IDataRepository {

  async saveSensorData(data: SensorData): Promise<void> {
    try {
      const writeApi = getWriteApi(); // obtém a instância do WriteApi

      const point = new Point('sensor_data') // nome da "measurement"
        .floatField('temperature', data.temperature)
        .floatField('ph', data.ph)
        .floatField('turbidity', data.turbidity)
        .floatField('tds', data.tds)
        .floatField('dissolved_oxygen', data.dissolvedOxygen)
        .timestamp(new Date());

      writeApi.writePoint(point);
      writeApi.writePoint(point);
      await writeApi.flush(); // <--- Isto força o envio ao Influx
    } catch (error) {
      console.error('Erro ao gravar dados no InfluxDB:', error);
    }
  }

  async getLastSensorData(numberOfData: number, thresholds: Thresholds, range: string): Promise<SensorData[]> {
    const queryApi = getQueryApi();

    const fluxQuery = `
      from(bucket: "sensor-data")
        |> range(start: ${range})
        |> filter(fn: (r) => r._measurement == "sensor_data")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: ${numberOfData})
    `;

    const results: SensorData[] = [];

    try {
      const rows = await new Promise<SensorData[]>((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);

            const data = new SensorData(
              o.temperature,
              o.ph,
              o.turbidity,
              o.tds,
              o.dissolved_oxygen,
              thresholds,
              o._time
            );

            results.push(data);
          },
          error(error) {
            reject(error);
          },
          complete() {
            resolve(results);
          }
        });
      });

      return rows;
    } catch (error) {
      console.error('Erro ao consultar os últimos dados do InfluxDB:', error);
      throw new Error('Erro ao consultar os dados');
    }
  }

  async getDataByRange(range: string, thresholds: Thresholds): Promise<SensorData[]> {
    const queryApi = getQueryApi();

    const fluxQuery = `
      from(bucket: "sensor-data")
        |> range(start: -${range})
        |> filter(fn: (r) => r._measurement == "sensor_data")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    `;

    const results: SensorData[] = [];

    try {
      const rows = await new Promise<any[]>((resolve, reject) => {
        const buffer: any[] = [];

        queryApi.queryRows(fluxQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);

            const data = new SensorData(
              o.temperature,
              o.ph,
              o.turbidity,
              o.tds,
              o.dissolved_oxygen,
              thresholds,
              o._time
            );

            results.push(data);
          },
          error(error) {
            reject(error);
          },
          complete() {
            resolve(results);
          }
        });
      });

      return rows;
    } catch (error) {
      console.error('Erro ao consultar dados por intervalo do InfluxDB:', error);
      throw new Error('Erro ao consultar os dados por intervalo');
    }
  }
}
