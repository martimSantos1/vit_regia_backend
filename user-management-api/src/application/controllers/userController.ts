import "reflect-metadata";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IUserController } from "./IControllers/IUserController";
import { IUserService } from "../services/IServices/IUserService";
import { setAuthCookies } from "../../utils/authUtils";

@injectable()
export class UserController implements IUserController {
    constructor(@inject("UserService") private userService: IUserService) { }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.userService.login(email, password);
            setAuthCookies(res, accessToken, refreshToken);
            return res.status(200).json({ message: "Login efetuado com sucesso" });
        } catch (error: any) {
            return res.status(401).json({ error: error.message });
        }
    }
    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, password, roleId } = req.body;
            const user = await this.userService.createUser({ name, email, password, roleId });
            return res.status(201).json(
                { message: "User created successfully", user }
            );
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json({ message: "List of all users", users });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.id;
            const user = await this.userService.getUserById(userId);
            return res.status(200).json({ message: "User found by id", user });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
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