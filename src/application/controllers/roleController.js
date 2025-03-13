import RoleService from '../../domain/services/roleService.js';
import RoleDTO from '../dto/roleDTO.js';

const roleService = new RoleService();

const roleController = {
    async createRole(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                throw new Error('Todos os campos são obrigatórios');
            }
            const roleDTO = new RoleDTO(req.body)
            const newRole = await roleService.createRole(roleDTO);
            res.status(201).json(newRole);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default roleController;