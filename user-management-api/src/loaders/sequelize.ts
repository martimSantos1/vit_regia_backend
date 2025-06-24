import { Sequelize } from 'sequelize-typescript';
import config from '../config';
import { Role } from '../domain/models/roles/role';
import { User } from '../domain/models/users/user';

interface Db {
  sequelize: Sequelize;
  models: {
    Role: typeof Role;
    User: typeof User;
  };
}

let dbInstance: Db | null = null;

const setupDatabase = async (): Promise<Db> => {
  if (dbInstance) return dbInstance;

  const sequelize = new Sequelize({
    dialect: config.database.server.dialect as any,
    host: config.database.server.host,
    port: config.database.server.port,
    username: config.database.user,
    password: config.database.password,
    database: config.database.name,
    models: [User, Role],
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Error connecting to the database:', err);
  }

  try {
    await sequelize.sync({ force: false });
    console.log('✅ Models synchronized successfully');
  } catch (err) {
    console.error('❌ Error synchronizing models:', err);
  }

  dbInstance = {
    sequelize,
    models: {
      Role,
      User,
    },
  };

  return dbInstance;
};

export default setupDatabase;