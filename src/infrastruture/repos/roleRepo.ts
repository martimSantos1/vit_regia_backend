import "reflect-metadata";
import { IRoleRepository } from "../../domain/repositories/IRoleRepository";
import { injectable } from "tsyringe";
import db from "../../loaders/sequelize";
import Role from "../../domain/entities/roles/role";

@injectable()
export class RoleRepository implements IRoleRepository {
    async create(role: Role): Promise<Role> {
        const database = await db();
        const roleName = role.getRoleName();
        const roleData = await database.roles.create({ name: roleName});
        return new Role(roleData.name, roleData.id);
    }

    async findAll(): Promise<Role[]> {
        const database = await db();
        const rolesData = await database.roles.findAll();
        return rolesData.map((roleData: any) => new Role(roleData.name));
    }
}