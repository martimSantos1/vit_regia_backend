import "reflect-metadata";
import { container } from "tsyringe";
import config from "../config";

const loadDependencies = () => {
  const dependencyGroups = [
    config.repos,
    config.services,
    config.controllers,    
  ];

  dependencyGroups.forEach((group) => {
    Object.values(group).forEach(({ token, useClass }) => {
      container.register(token, { useClass });

      try {
        const resolved = container.resolve(token as any);
        console.log(`✅ [container] ${token} => ${(resolved as object).constructor.name}`);
      } catch (err: any) {
        console.error(`❌ [container] Falha ao resolver ${token}: ${err.message}`);
      }
    });
  });
};

export { container, loadDependencies };