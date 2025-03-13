import { Sequelize, DataTypes } from 'sequelize';

// Database connection with dialect of postgres specifying the database we are using
// port for my database is 5432
// database name is vitoriaRegiaDB
// username is postgres
// password is Gecad25
// host is localhost
const sequelize = new Sequelize(`postgres://postgres:Gecad25@localhost:5432/vitoriaRegiaDB`, { dialect: "postgres" });

// Checking if connection is done
sequelize.authenticate().then(() => {
    console.log(`✅ Database connected successfully`);
}).catch((err) => {
    console.log("❌ Error connecting to the database:", err);
});

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
sequelize.sync().then(() => {
    console.log("✅ Models synchronized successfully");
}).catch((err) => {
    console.log("❌ Error synchronizing models:", err);
});

// Exporting the module
export default db;