import { Application } from "express";
import expressLoader from "./express";
import { loadDependencies } from "./dependencyInjector";

export default async ({ expressApp }: { expressApp: Application }) => {
  loadDependencies(); // Carrega e verifica os serviços
  console.log("✌️ Dependency Injector loaded");

  await expressLoader({ app: expressApp });
  console.log("✌️ Express loaded");
};
