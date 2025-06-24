import { Role } from "../../../domain/models/roles/role";

export interface IRoleService {
    createRole(data: string): Promise<Role>;
    getAllRoles(): Promise<Role[]>;
}