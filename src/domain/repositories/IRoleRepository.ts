import { Role } from "../entities/roles/role";

export interface IRoleRepository{
    create(data: Partial<Role>): Promise<Role>;
    findAll(): Promise<Role[]>;
}