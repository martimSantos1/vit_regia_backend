import { Application } from "express";
import expressLoader from "./express";
import { loadDependencies } from "./dependencyInjector";
import { getInfluxClient } from "./influx";

export default async ({ expressApp }: { expressApp: Application }) => {
  loadDependencies(); // Carrega e verifica os serviços
  console.log("✌️ Dependency Injector loaded");

  await expressLoader({ app: expressApp });
  console.log("✌️ Express loaded");

  await getInfluxClient();
  console.log("✌️ InfluxDB client loaded");
};
