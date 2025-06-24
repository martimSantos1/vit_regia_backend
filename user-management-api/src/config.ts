import dotenv from 'dotenv';
import { RoleController } from "./application/controllers/roleController";
import { RoleService } from "./application/services/roleService";
import { RoleRepository } from "./infrastruture/repos/roleRepo";

import { UserRepository } from "./infrastruture/repos/userRepo";
import { UserService } from './application/services/userService';
import { UserController } from './application/controllers/userController';

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
    frontendUrl: string;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    api: ApiConfig;
    controllers: {
        role: ControllerConfig;
        user: ControllerConfig;
    };
    services: {
        role: ControllerConfig;
        user: ControllerConfig;
    };
    repos: {
        role: ControllerConfig;
        user: ControllerConfig;
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

    frontendUrl: getEnvVariable('FRONTEND_URL'),

    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'my sakdfho2390asjod$%jl)!sdjas0i secret',

    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'my s$dr#ftg23321aspu%$%jlklgmuas0i secret',

    api: {
        prefix: '/api',
    },

    repos: {
        role: {
            token: "RoleRepository",
            useClass: RoleRepository,
        },
        user: {
            token: "UserRepository",
            useClass: UserRepository,
        }
    },
    services: {
        role: {
            token: "RoleService",
            useClass: RoleService,
        },
        user: {
            token: "UserService",
            useClass: UserService,
        }
    },
    controllers: {
        role: {
            token: "RoleController",
            useClass: RoleController,
        },
        user: {
            token: "UserController",
            useClass: UserController,
        }
    },
};

export default config;