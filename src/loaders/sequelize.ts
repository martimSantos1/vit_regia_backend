import { Sequelize, DataTypes, ModelStatic } from 'sequelize';
import { RoleModel } from '../infrastruture/models/roleModel';
import config from '../config';

interface Db {
    Sequelize: typeof Sequelize;
    sequelize: Sequelize;
    roles: ModelStatic<any>;
}

let dbInstance: Db | null = null;

const setupDatabase = async (): Promise<Db> => {
    if (dbInstance) {
        // Retorna a instância existente se já foi inicializada
        return dbInstance;
    }

    const sequelize = new Sequelize(
        config.database.name,
        config.database.user,
        config.database.password,
        {
            host: config.database.server.host,
            port: config.database.server.port,
            dialect: config.database.server.dialect as any, // Sequelize espera um DialectType
        }
    );

    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.log('❌ Error connecting to the database:', err);
    }

    dbInstance = {
        Sequelize,
        sequelize,
        roles: RoleModel(sequelize, DataTypes),
    };

    try {
        // `alter: true` para ajustar as tabelas sem as apagar
        await sequelize.sync({ alter: true });
        console.log('✅ Models synchronized successfully');
    } catch (err) {
        console.log('❌ Error synchronizing models:', err);
    }

    return dbInstance;
};

export default setupDatabase;