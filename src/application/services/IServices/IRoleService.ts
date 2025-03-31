import RoleDTO from "../../dto/roleDTO.js";
import Role from "../../../domain/roles/role.js";

export default interface IRoleService {
    createRole(roleDTO: RoleDTO): Promise<Role>;
}
