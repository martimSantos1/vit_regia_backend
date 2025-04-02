import { Container } from 'typedi';
import LoggerInstance from './logger.js';

export default async ({ sequelizeConnection, controllers, repos, services }: {
    sequelizeConnection: any;
    controllers: { name: string; path: string }[];
    repos: { name: string; path: string }[];
    services: { name: string; path: string }[];
}) => {
    try {
        Container.set('logger', LoggerInstance);

        LoggerInstance.info('Injecting repositories into container');
        for (const m of repos) {
            console.log(`Loading module from: ${m.path}`);
            const repoModule = await import(m.path);
            const repoClass = repoModule.default;
            const repoInstance = Container.get(repoClass);
            Container.set(m.name, repoInstance);
            console.log(`Repository ${m.name} loaded`);
        }

        LoggerInstance.info('\nInjecting services into container');
        for (const m of services) {
            console.log(`Loading module from: ${m.path}`);
            const serviceModule = await import(m.path);
            const serviceClass = serviceModule.default;
            const serviceInstance = Container.get(serviceClass);
            Container.set(m.name, serviceInstance);
            console.log(`Service ${m.name} loaded`);
        }

        LoggerInstance.info('\nInjecting controllers into container');
        for (const m of controllers) {
            console.log(`Loading module from: ${m.path}`);
            const controllerModule = await import(m.path);
            const controllerClass = controllerModule.default;
            const controllerInstance = Container.get(controllerClass);
            Container.set(m.name, controllerInstance);
            console.log(`Controller ${m.name} loaded`);
        }

        return;
    } catch (e) {
        LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
