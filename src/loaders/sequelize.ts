import { Sequelize, DataTypes, ModelStatic } from 'sequelize';
import { RoleModel } from '../infrastruture/models/roleModel';
import config from '../config';
import { UserModel } from '../infrastruture/models/userModel';

interface Db {
    Sequelize: typeof Sequelize;
    sequelize: Sequelize;
    roles: ModelStatic<any>;
    users: ModelStatic<any>;
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
        users: UserModel(sequelize, DataTypes),
    };

    // Definir a relação entre users e roles
    dbInstance.roles.hasMany(dbInstance.users, {
        foreignKey: 'roleId', // Nome da chave estrangeira na tabela users
        as: 'users', // Alias para a relação
    });
    dbInstance.users.belongsTo(dbInstance.roles, {
        foreignKey: 'roleId', // Nome da chave estrangeira na tabela users
        as: 'role', // Alias para a relação
    });


    try {
        await sequelize.sync({ force: false });
        console.log('✅ Models synchronized successfully');
    } catch (err) {
        console.log('❌ Error synchronizing models:', err);
    }

    return dbInstance;
};

export default setupDatabase;