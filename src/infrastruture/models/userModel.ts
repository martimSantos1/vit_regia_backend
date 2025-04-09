import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelStatic } from "sequelize";

export const UserModel = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelStatic<Model> => {
    class User extends Model {
        id!: number;
        userName!: string;
        fullName!: string;
        email!: string;
        password!: string;
        roleId!: number;
    }

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userName:{
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            fullName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'roles',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
        }
    );
    return User;
}