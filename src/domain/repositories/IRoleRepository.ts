import Role from "../entities/roles/role";

export interface IRoleRepository{
    create(data: Role): Promise<Role>;
    findAll(): Promise<Role[]>;
}