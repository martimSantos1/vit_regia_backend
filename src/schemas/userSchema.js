export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Roles',
                key: 'id'
            },
            allowNull: false
        }
    });

    return User;
};