import Role from "../../domain/roles/role.js";
import IRoleService from "../services/IServices/IRoleService.js";
import IRoleRepo from "../../infrastructure/repositories/IRepos/IRoleRepo.js";
import RoleDTO from "../dto/roleDTO.js";

import { Service, Inject } from 'typedi';
import config from "../../config.js";

@Service()
export default class RoleService implements IRoleService {

    // Injeta o RoleRepo
    constructor(
        @Inject(config.repos.role.name) private roleRepo: IRoleRepo
    ) {}

    async createRole(roleDTO: RoleDTO): Promise<Role> {
        const existingRole = await this.roleRepo.findByName(roleDTO.name);
        if (existingRole) throw new Error("⚠️ Já existe um cargo com este nome!");

        const newRole = new Role(roleDTO.name);
        return await this.roleRepo.create(newRole);
    }
}
