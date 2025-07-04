import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { IRoleService } from "./IServices/IRoleService";
import { Role } from "../../domain/models/roles/role";
import { IRoleRepository } from "../../domain/repositories/IRoleRepository";

@injectable()
export class RoleService implements IRoleService {
    constructor(@inject("RoleRepository") private roleRepository: IRoleRepository) { }

    async createRole(data: string): Promise<Role> {
        if (!data) {
            throw new Error("Role name is required");
        }
        const existingRoles = await this.roleRepository.findAll();
        const roleExists = existingRoles.some((role) => role.name.toLowerCase() === data.toLocaleLowerCase());
        if (roleExists) {
            throw new Error("Role already exists");
        }
        const createdRole = await this.roleRepository.create({ name: data });
        return createdRole;
    }

    async getAllRoles(): Promise<Role[]> {
        return this.roleRepository.findAll();
    }
}