import IRoleController from './IControllers/IRoleController.js';
import IRoleService from '../services/IServices/IRoleService.js';
import RoleDTO from '../dto/roleDTO.js';

import { Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { Container } from 'typedi';
import config from '../../config.js';

// Injeção de dependência
@Service() // Regista o controlador como um serviço no TypeDI
export default class RoleController implements IRoleController {

    // Injeta o RoleService
    constructor(
        @Inject(config.services.role.name) private roleService: IRoleService
    ) {
        console.log('RoleController instantiated\nRoleService injected:', this.roleService);
        const testService = Container.get(config.services.role.name);
        console.log('Resolved RoleService:', testService);
    }

    async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name } = req.body;
            if (!name) {
                throw new Error('Todos os campos são obrigatórios');
            }
            const roleDTO = new RoleDTO(req.body);
            const newRole = await this.roleService.createRole(roleDTO); // Usando a instância injetada
            res.status(201).json(newRole);
        } catch (e: any) {
            console.log(e)
            return next(e);
        }
    }
}
