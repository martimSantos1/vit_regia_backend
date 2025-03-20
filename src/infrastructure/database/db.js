import { Sequelize, DataTypes } from 'sequelize';

const setupDatabase = async () => {
    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: "postgres"
        }
    );

    // Checking if connection is done
    try {
        await sequelize.authenticate();
        console.log(`✅ Database connected successfully`);
    } catch (err) {
        console.log("❌ Error connecting to the database:", err);
    }

    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    // Connecting to models
    db.users = (await import('../schemas/userSchema.js')).default(sequelize, DataTypes);
    db.roles = (await import('../schemas/roleSchema.js')).default(sequelize, DataTypes);

    // Setting up associations
    db.users.belongsTo(db.roles, { foreignKey: 'roleId' });
    db.roles.hasMany(db.users, { foreignKey: 'roleId' });

    // Verifying model synchronization
    try {
        await sequelize.sync();
        console.log("✅ Models synchronized successfully");
    } catch (err) {
        console.log("❌ Error synchronizing models:", err);
    }

    return db;
};

export default setupDatabase;