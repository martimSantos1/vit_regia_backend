import "reflect-metadata";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IRoleController } from "./IControllers/IRoleController";
import { IRoleService } from "../services/IServices/IRoleService";

@injectable()
export class RoleController implements IRoleController {
    constructor(@inject("RoleService") private roleService: IRoleService) {}

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = req.body;
            const role = await this.roleService.createRole(name);
            return res.status(201).json(role);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const roles = await this.roleService.getAllRoles();
            return res.status(200).json(roles);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}