import { InfluxDB, WriteApi, QueryApi } from '@influxdata/influxdb-client';
import config from '../config';

let writeApi: WriteApi;
let queryApi: QueryApi;

export function initializeInflux() {
  const { url, token, org, bucket } = config.database;

  const influxClient = new InfluxDB({ url, token });

  writeApi = influxClient.getWriteApi(org, bucket, 'ns'); // ns = precisão em nanossegundos
  writeApi.useDefaultTags({ app: 'sensor-data-api' });

  queryApi = influxClient.getQueryApi(org);

  console.log('✅ InfluxDB initialized');
}

export function getWriteApi(): WriteApi {
  if (!writeApi) {
    throw new Error('InfluxDB write API not initialized. Call initializeInflux() first.');
  }
  return writeApi;
}

export function getQueryApi(): QueryApi {
  if (!queryApi) {
    throw new Error('InfluxDB query API not initialized. Call initializeInflux() first.');
  }
  return queryApi;
}