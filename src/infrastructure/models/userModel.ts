// src/models/User.ts
import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelStatic } from 'sequelize';

export const UserModel = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelStatic<Model> => {
    class User extends Model {
        id!: number;
        userName!: string;
        email!: string;
        password!: string;
        roleId!: number;

        static associate(models: any) {
            User.belongsTo(models.roles, { foreignKey: 'roleId' });
        }
    }

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
        }
    );
    return User;
};