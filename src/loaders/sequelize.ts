import { Sequelize, DataTypes, ModelStatic } from 'sequelize';
import { UserModel } from '../infrastructure/models/userModel.js';
import { RoleModel } from '../infrastructure/models/roleModel.js';
import config from '../config.js';

interface Db {
    Sequelize: typeof Sequelize;
    sequelize: Sequelize;
    users: ModelStatic<any>;
    roles: ModelStatic<any>;
}

const setupDatabase = async (): Promise<Db> => {
    const sequelize = new Sequelize(
        config.database.name, // Nome do banco
        config.database.user, // Usuário
        config.database.password, // Senha
        {
            host: config.database.server.host,
            port: config.database.server.port,
            dialect: config.database.server.dialect as any // 👈 Sequelize espera um DialectType
        }
    );
    

    // Checking if connection is done
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.log('❌ Error connecting to the database:', err);
    }

    const db: Db = {
        Sequelize,
        sequelize,
        users: UserModel(sequelize, DataTypes),
        roles: RoleModel(sequelize, DataTypes),
    };

    // Setting up associations
    db.users.belongsTo(db.roles, { foreignKey: 'roleId' });
    db.roles.hasMany(db.users, { foreignKey: 'roleId' });

    // Verifying model synchronization
    try {
        await sequelize.sync();
        console.log('✅ Models synchronized successfully');
    } catch (err) {
        console.log('❌ Error synchronizing models:', err);
    }

    return db;
};

export default setupDatabase;
