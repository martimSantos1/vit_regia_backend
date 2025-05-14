import "reflect-metadata";
import { IRoleRepository } from "../../domain/repositories/IRoleRepository";
import { injectable } from "tsyringe";
import setupDatabase from "../../loaders/sequelize";
import { Role } from "../../domain/entities/roles/role";
import { CreationAttributes } from 'sequelize';


@injectable()
export class RoleRepository implements IRoleRepository {
    async create(role: { name: string }): Promise<Role> {
        const db = await setupDatabase();
        const created = await db.models.Role.create(role as CreationAttributes<Role>);
        return created;
    }

    async findAll(): Promise<Role[]> {
        const db = await setupDatabase();
        const roles = await db.models.Role.findAll();
        return roles;
    }
}