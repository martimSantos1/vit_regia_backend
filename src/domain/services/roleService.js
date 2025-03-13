import { roleRepo } from "../../infrastructure/repositories/roleRepo.js";
import Role from "../../domain/entities/role.js";

export default class RoleService {
    constructor() {
        this.roleRepo = new roleRepo();
    }

    async createRole(roleDTO) {
        const existingRole = await this.roleRepo.findByName(roleDTO.name);
        if (existingRole) throw new Error("⚠️ Já existe um cargo com este nome!");

        const newRole = new Role(null, roleDTO.name);
        return await this.roleRepo.create(newRole);
    }
}