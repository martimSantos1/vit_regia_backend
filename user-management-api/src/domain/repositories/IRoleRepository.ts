import { Role } from "../entities/roles/role";

export interface IRoleRepository {
    create(role: { name: string }): Promise<Role>;
    findAll(): Promise<Role[]>;
}