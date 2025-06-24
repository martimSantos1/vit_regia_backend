import { Role } from "../models/roles/role";

export interface IRoleRepository {
    create(role: { name: string }): Promise<Role>;
    findAll(): Promise<Role[]>;
}