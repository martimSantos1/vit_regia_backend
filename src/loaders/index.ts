import expressLoader from "./express.js";
import { Application } from "express";
import Logger from "./logger.js";
import sequilizeLoader from "./sequelize.js";
import dependencyInjectorLoader from "./dependencyInjector.js";
import config from "../config.js";

export default async ({ expressApp }: { expressApp: Application }) => {
    const sequelizeConnection = await sequilizeLoader();
    Logger.info("DB loaded and connected!");

    const roleController = {
        name: config.controllers.role.name,
        path: config.controllers.role.path
    }

    const userController = {
        name: config.controllers.user.name,
        path: config.controllers.user.path
    }

    const roleService = {
        name: config.services.role.name,
        path: config.services.role.path
    }

    const userService = {
        name: config.services.user.name,
        path: config.services.user.path
    }

    const roleRepo = {
        name: config.repos.role.name,
        path: config.repos.role.path
    }

    const userRepo = {
        name: config.repos.user.name,
        path: config.repos.user.path
    }

    await dependencyInjectorLoader({
        sequelizeConnection,
        controllers: [roleController, userController],
        repos: [roleRepo, userRepo],
        services: [roleService, userService]
    });

    Logger.info('\n✌️ Controllers, Repositories and Services loaded');

    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
};