import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash the whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

// Define types for the configuration
interface DatabaseConfig {
  name: string;
  user: string;
  password: string;
  server:{
    host: string;
    port: number;
    dialect: string;
  }
}

interface LoggerConfig {
  level: string;
}

interface ApiConfig {
  prefix: string;
}

interface ControllerConfig {
  name: string;
  path: string;
}

interface Config {
  port: number;
  database: DatabaseConfig;
  jwtSecret: string;
  logs: LoggerConfig;
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

// Export the configuration object with proper types
const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),

  database: {
    name: process.env.DB_NAME || 'gecad_vitoria_regia_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'Gecad25',
    server: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      dialect: process.env.DB_DIALECT || 'postgres',
    }
  },

  jwtSecret: process.env.JWT_SECRET || 'my sakdfho2390asjod$%jl)!sdjas0i secret',

  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  api: {
    prefix: '/api',
  },

  controllers: {
    role: {
      name: "RoleController",
      path: "../application/controllers/roleController.js",
    },
    user: {
      name: "UserController",
      path: "../application/controllers/userController.js",
    },
  },

  services: {
    role: {
      name: "RoleService",
      path: "../application/services/roleService.js",
    },
    user: {
      name: "UserService",
      path: "../application/services/userService.js",
    },
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../infrastructure/repositories/roleRepo.js",
    },
    user: {
      name: "UserRepo",
      path: "../infrastructure/repositories/userRepo.js",
    },
  },
};

export default config;