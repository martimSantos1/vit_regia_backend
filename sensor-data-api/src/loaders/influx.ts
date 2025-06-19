import config from '../config';
import { InfluxDB } from '@influxdata/influxdb-client'

const influxClient = new InfluxDB({ url: config.database.url, token: config.database.token });

export const getInfluxClient = () => influxClient
export const influxConfig = {
  org: config.database.org,
  bucket: config.database.bucket,
}