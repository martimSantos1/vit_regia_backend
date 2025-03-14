// Importing modules
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './src/infrastructure/database/db.js';
import userRoutes from './src/api/routes/userRoute.js';
import rolesRoutes from './src/api/routes/roleRoute.js';

dotenv.config();

// Setting up your port
const PORT = process.env.PORT || 5000;

// Assigning the variable app to express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
