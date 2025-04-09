import { Role } from "../../../domain/entities/roles/role";

export interface IRoleService {
    createRole(data: Partial<Role>): Promise<Role>;
    getAllRoles(): Promise<Role[]>;
}