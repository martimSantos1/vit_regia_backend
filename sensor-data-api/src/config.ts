import dotenv from 'dotenv';
import { DataController } from './application/controllers/dataController';
import { DataService } from './application/services/dataService';
import { DataRepository } from './infrastructure/repos/dataRepository';

const result = dotenv.config();
if (result.error) {
    throw new Error("⚠️  Couldn't load .env file: " + result.error);
}


interface DatabaseConfig {
    url: string;
    token: string;
    org: string;
    bucket: string;
}

interface ApiConfig {
    prefix: string;
}

interface ComponentConfig {
    token: string;
    useClass: new (...args: any[]) => any;
}

interface Config {
    port: number;
    database: DatabaseConfig;
    api: ApiConfig;
    controllers: {
        data: ComponentConfig;
    };
    services: {
        data: ComponentConfig;
    };
    repos: {
        data: ComponentConfig;
    };
}

function getEnvVariable(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        url: getEnvVariable('DB_URL') || 'http://localhost:8086',
        token: getEnvVariable('DB_TOKEN') || 'cooYRBz96jXbZSlaamJ9ma2l-aBHNRmGZQyf56rAtrw0LuQonuEt4elVo7ONb1R8CEmuFE6O992czlVigNgF2Q==',
        org: getEnvVariable('DB_ORG') || 'vitoria_regia',
        bucket: getEnvVariable('DB_BUCKET') || 'sensor_data'
    },
    api: {
        prefix: getEnvVariable('API_PREFIX') || '/api',
    },
    controllers: {
        data: {
            token: 'DataController',
            useClass: DataController
        }
    },
    services: {
        data: {
            token: 'DataService',
            useClass: DataService
        }
    },
    repos: {
        data: {
            token: 'DataRepository',
            useClass: DataRepository
        }
    }
};
export default config;