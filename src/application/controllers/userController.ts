import IUserController from './IControllers/IUserController.js';
import IUserService from '../services/IServices/IUserService.js';
import UserDTO from '../dto/userDTO.js';

import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config.js';

@Service()
export default class UserController implements IUserController{
    constructor(
        @Inject(config.services.user.name) private userService: IUserService
    ){}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { userName, email, password, roleId } = req.body;
            if (!userName || !email || !password || !roleId) {
                throw new Error('Todos os campos são obrigatórios');
            }
            const userDTO = new UserDTO(req.body);
            const newUser = await this.userService.register(userDTO);
            res.status(201).json(newUser);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await this.userService.login(email, password);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // Descomente quando o método estiver em uso
    // async updateUserName(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { userName } = req.body;
    //         const updatedUser = await userService.updateUserName(req.user.id, userName);
    //         res.status(200).json(updatedUser);
    //     } catch (error: any) {
    //         res.status(400).json({ message: error.message });
    //     }
    // }
}
