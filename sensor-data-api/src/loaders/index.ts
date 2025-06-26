import { Application } from "express";
import expressLoader from "./express";
import { loadDependencies } from "./dependencyInjector";
import { initializeInflux } from "./influx";
import { initializeFirebase } from "./firebase";

export default async ({ expressApp }: { expressApp: Application }) => {
  loadDependencies();
  console.log("✌️ Dependency Injector loaded");

  await expressLoader({ app: expressApp });
  console.log("✌️ Express loaded");

  await initializeInflux();
  console.log("✌️ InfluxDB client loaded");

  initializeFirebase();
  console.log("✌️ Firebase initialized");
};
