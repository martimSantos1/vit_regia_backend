import { InfluxDB, WriteApi } from '@influxdata/influxdb-client';
import config from '../config';

let writeApi: WriteApi;

export function initializeInflux() {
  const { url, token, org, bucket } = config.database;

  const influxClient = new InfluxDB({ url, token });

  writeApi = influxClient.getWriteApi(org, bucket, 'ns'); // ns = precisão em nanossegundos
  writeApi.useDefaultTags({ app: 'sensor-data-api' });

  console.log('✅ InfluxDB initialized');
}

export function getWriteApi(): WriteApi {
  if (!writeApi) {
    throw new Error('InfluxDB write API not initialized. Call initializeInflux() first.');
  }
  return writeApi;
}