import UserService from '../../domain/services/userService.js';
import UserDTO from '../dto/userDTO.js';

const userService = new UserService();

const userController = {
    async register(req, res) {
        try {
            const { userName, email, password, role } = req.body;
            if (!userName || !email || !password || !role) {
                throw new Error('Todos os campos são obrigatórios');
            }
            const userDTO = new UserDTO(req.body);
            const newUser = await userService.register(userDTO);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.login(email, password);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // async updateUserName(req, res) {
    //     try {
    //         const { userName } = req.body;
    //         const updatedUser = await userService.updateUserName(req.user.id, userName);
    //         res.status(200).json(updatedUser);
    //     } catch (error) {
    //         res.status(400).json({ message: error.message });
    //     }
    // }

};

export default userController;