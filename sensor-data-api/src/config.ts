import dotenv from 'dotenv';
import { DataController } from './application/controllers/dataController';
import { DataService } from './application/services/dataService';
import { DataRepository } from './infrastructure/repos/dataRepository';

const result = dotenv.config();
if (result.error) {
    throw new Error("⚠️  Couldn't load .env file: " + result.error);
}


interface DatabaseConfig {
    name: string;
    user: string;
    password: string;
    server: {
        host: string;
        port: number;
        dialect: string;
    }
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
        name: getEnvVariable('DB_NAME'),
        user: getEnvVariable('DB_USER'),
        password: getEnvVariable('DB_PASSWORD'),
        server: {
            host: getEnvVariable('DB_HOST'),
            port: parseInt(process.env.DB_PORT || '5432', 10),
            dialect: getEnvVariable('DB_DIALECT') as 'postgres' | 'mysql' | 'sqlite' | 'mssql',
        }
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