import { Application } from "express";
import expressLoader from "./express";
import { loadDependencies } from "./dependencyInjector";
import { initializeInflux } from "./influx";

export default async ({ expressApp }: { expressApp: Application }) => {
  loadDependencies(); // Carrega e verifica os serviços
  console.log("✌️ Dependency Injector loaded");

  await expressLoader({ app: expressApp });
  console.log("✌️ Express loaded");

  await initializeInflux();
  console.log("✌️ InfluxDB client loaded");
};
