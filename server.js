import express from 'express';
import dotenv from 'dotenv';
dotenv.config();  // Carrega as variáveis de ambiente

console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);

import cookieParser from 'cookie-parser';
import cors from 'cors';
import setupDatabase from './src/infrastructure/database/db.js';  // Importar a função assíncrona
import userRoutes from './src/api/routes/userRoute.js';
import rolesRoutes from './src/api/routes/roleRoute.js';

// Setting up your port
const PORT = process.env.PORT || 5000;

// Assigning the variable app to express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Agora chamamos a função para configurar o banco de dados
setupDatabase().then((db) => {
    // Synchronizing the database and forcing it to false so we don't lose data
    db.sequelize.sync({ force: false }).then(() => {
        console.log("Database has been re-synced");
    }).catch((err) => {
        console.log("Error synchronizing the database:", err);
    });

    // Routes for the user API
    app.use('/api/users', userRoutes);
    app.use('/api/roles', rolesRoutes);

    // Listening to server connection
    app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
}).catch((err) => {
    console.log("Error setting up the database:", err);
});
