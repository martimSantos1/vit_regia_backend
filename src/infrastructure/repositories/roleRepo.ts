import db from '../../loaders/sequelize.js';
import Role from '../../domain/roles/role.js';
import IRoleRepo from './IRepos/IRoleRepo.js';

import { Service } from 'typedi';


@Service()
export default class RoleRepo implements IRoleRepo {
    async findById(id: number): Promise<Role | null> {
        const database = await db();
        const roleData = await database.roles.findByPk(id);
        if (!roleData) {
            return null;
        }
        // Map the database entity to the domain model
        return new Role(roleData.name, roleData.id);
    }

    async findByName(name: string): Promise<Role | null> {
        const database = await db();
        const roleData = await database.roles.findOne({ where: { name } });
        if (!roleData) {
            return null;
        }
        // Map the database entity to the domain model
        return new Role(roleData.name, roleData.id);
    }

    async create(role: Role): Promise<Role> {
        // Map the domain model to the database entity
        const database = await db();
        const roleData = await database.roles.create({ name: role.name.getName() });
        // Return the created role as a domain model
        return new Role(roleData.name, roleData.id);
    }
}