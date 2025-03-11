import RoleService from "../services/roleService.js";

const roleService = new RoleService();

const createRole = async (req, res) => {
    try {
        console.log("createRole:", req.body);
        const { roleName } = req.body;
        if (!roleName) {
            return res.status(403).send("Missing required fields");
        }
        const result = await roleService.createRole(roleName);
        if (!result) {
            return res.status(500).send("Error creating role");
        }
        if (result) {
            console.log("role", JSON.stringify(result, null, 2));
            return res.status(201).send(result);
        } else {
            return res.status(409).send("Details are not correct");
        }
    } catch (error) {
        console.log("Error in createRole:", error);
        res.status(500).send("Internal Server Error");
    }
}

export default {
    createRole
};