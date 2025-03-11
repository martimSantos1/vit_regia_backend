import db from "../schemas/index.js";

const Role = db.roles;

export default class RoleService {
    async createRole(inputRole) {
        try {
            const role = await Role.create({
                roleName: inputRole
            });
            console.log("Role created:", role);
            return role;
        } catch (error) {
            console.log("Error in createRole:", error);
            return null;
        }
    }
}