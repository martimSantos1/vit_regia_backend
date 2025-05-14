import { Application } from "express";
import expressLoader from "./express";
import { loadDependencies } from "./dependencyInjector";
import sequelizeLoader from "./sequelize";

export default async ({ expressApp }: { expressApp: Application }) => {
  const db = await sequelizeLoader();
  expressApp.set("db", db); // Adiciona a db à instância do Express
  console.log("✌️ DB loaded and connected!");

  loadDependencies(); // Carrega e verifica os serviços
  console.log("✌️ Dependency Injector loaded");

  await expressLoader({ app: expressApp });
  console.log("✌️ Express loaded");
};
