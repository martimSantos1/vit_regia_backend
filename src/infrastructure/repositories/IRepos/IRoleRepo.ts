import Role from "../../../domain/roles/role.js";

export default interface IRoleRepo {
    findById(id: number): Promise<Role | null>;
    findByName(name: string): Promise<Role | null>;
    create(role: Role): Promise<Role>;
}