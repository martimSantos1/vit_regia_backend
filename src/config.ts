import { RoleController } from "./application/controllers/roleController";
import { RoleService } from "./application/services/roleService";
import { RoleRepository } from "./infrastruture/repos/roleRepo";
import dotenv from 'dotenv';

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
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

interface ControllerConfig {
    token: string;
    useClass: new (...args: any[]) => any;
}

interface Config {
    port: number;
    database: DatabaseConfig;
    jwtSecret: string;
    api: ApiConfig;
    controllers: {
        role: ControllerConfig;
    };
    services: {
        role: ControllerConfig;
    };
    repos: {
        role: ControllerConfig;
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
    port: parseInt(process.env.PORT || '5000', 10),

    database: {
        name: getEnvVariable('DB_NAME'),
        user: getEnvVariable('DB_USER'),
        password: getEnvVariable('DB_PASSWORD'),
        server: {
            host: getEnvVariable('DB_HOST'),
            port: parseInt(process.env.DB_PORT || '5432', 10),
            dialect: getEnvVariable('DB_DIALECT'),
        }
    },

    jwtSecret: process.env.JWT_SECRET || 'my sakdfho2390asjod$%jl)!sdjas0i secret',

    api: {
        prefix: '/api',
    },

    repos: {
        role: {
            token: "RoleRepository",
            useClass: RoleRepository,
        },
    },
    services: {
        role: {
            token: "RoleService",
            useClass: RoleService,
        },
    },
    controllers: {
        role: {
            token: "RoleController",
            useClass: RoleController,
        },
    },
};

export default config;