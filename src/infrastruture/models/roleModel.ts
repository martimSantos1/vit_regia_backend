import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelStatic } from 'sequelize';

export const RoleModel = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelStatic<Model> => {
    class Role extends Model {
        id!: number;
        name!: string;
    }

    Role.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Role',
            tableName: 'roles',
        }
    );
    return Role;
};