import { Role } from "../../../domain/entities/roles/role";

export interface IRoleService {
    createRole(data: string): Promise<Role>;
    getAllRoles(): Promise<Role[]>;
}