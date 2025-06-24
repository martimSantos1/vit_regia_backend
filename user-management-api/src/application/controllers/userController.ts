import "reflect-metadata";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IUserController } from "./IControllers/IUserController";
import { IUserService } from "../services/IServices/IUserService";
import { setAuthCookies, verifyRefreshToken, generateAccessToken, clearAuthCookies } from "../../utils/authUtils";

@injectable()
export class UserController implements IUserController {
    constructor(@inject("UserService") private userService: IUserService) { }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken, userDto } = await this.userService.login(email, password);
            setAuthCookies(res, accessToken, refreshToken);
            return res.status(200).json({ message: "Login efetuado com sucesso", user: userDto });
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
    async logout(req: Request, res: Response): Promise<Response> {
        try {
            clearAuthCookies(res); // limpa os cookies de autenticação

            return res.status(200).json({ message: "Logout efetuado com sucesso" });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
    async refreshToken(req: Request, res: Response): Promise<Response> {
        try {
            const refreshToken = req.cookies?.refresh_token;
            if (!refreshToken) {
                return res.status(401).json({ error: "Refresh token não encontrado" });
            }

            const decoded: any = verifyRefreshToken(refreshToken);
            const user = await this.userService.getUserById(decoded.id);

            if (!user) {
                return res.status(404).json({ error: "Utilizador não encontrado" });
            }

            const accessToken = generateAccessToken({ id: user.id, roleId: user.role?.id });
            setAuthCookies(res, accessToken, refreshToken); // renova o access_token

            return res.status(200).json({ message: "Token renovado", user: user });
        } catch (error: any) {
            return res.status(403).json({ error: "Refresh token inválido ou expirado" });
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
            const userId = (req as any).user.id;
            const { name } = req.body;
            const updatedUser = await this.userService.updateUser(userId, name);
            return res.status(200).json({ message: "Username atualizado", user: updatedUser });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Falta implementar os métodos de delete
    async delete(req: Request, res: Response): Promise<Response> {
        try {
            console.log("delete");
            return res.status(200).json({ message: "User deleted successfully" });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}