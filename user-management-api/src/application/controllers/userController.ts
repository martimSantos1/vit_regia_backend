import "reflect-metadata";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IUserController } from "./IControllers/IUserController";
import { IUserService } from "../services/IServices/IUserService";

@injectable()
export class UserController implements IUserController {
    constructor(@inject("UserService") private userService: IUserService) { }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, password, roleId } = req.body;
            const user = await this.userService.createUser({ name, email, password, roleId });
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json(users);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
    async getById(req: Request, res: Response): Promise<Response> {
        try {
            console.log("getById");
            return res.status(200).json({ message: "getById" });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
    async update(req: Request, res: Response): Promise<Response> {
        try {
            console.log("update");
            return res.status(200).json({ message: "update" });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
    async delete(req: Request, res: Response): Promise<Response> {
        try {
            console.log("delete");
            return res.status(200).json({ message: "User deleted successfully" });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}