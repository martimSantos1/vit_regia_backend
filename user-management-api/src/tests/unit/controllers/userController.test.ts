import "reflect-metadata";
import { Request, Response } from "express";
import { UserController } from "../../../application/controllers/userController";
import { IUserService } from "../../../application/services/IServices/IUserService";
import { UserDto } from "../../../application/dto/userDTO";
import * as authUtils from "../../../utils/authUtils";

describe("UserController", () => {
  let userService: jest.Mocked<IUserService>;
  let userController: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    userService = {
      login: jest.fn(),
      createUser: jest.fn(),
      deleteUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
    } as unknown as jest.Mocked<IUserService>;

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn().mockReturnThis(),
    };

    userController = new UserController(userService);
  });

  describe("login", () => {
    it("should login successfully and set cookies", async () => {
      const userDto = { id: 1, name: "Martim", email: "martim@example.com" } as UserDto;
      const accessToken = "access-token";
      const refreshToken = "refresh-token";
      req.body = { email: "martim@example.com", password: "pass" };

      jest.spyOn(userService, "login").mockResolvedValue({ userDto, accessToken, refreshToken });
      jest.spyOn(authUtils, "setAuthCookies").mockImplementation(jest.fn());

      await userController.login(req as Request, res as Response);

      expect(userService.login).toHaveBeenCalled();
      expect(authUtils.setAuthCookies).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Login efetuado com sucesso", user: userDto });
    });

    it("should return 401 if login fails", async () => {
      req.body = { email: "fail@example.com", password: "wrong" };
      jest.spyOn(userService, "login").mockRejectedValue(new Error("User not found"));

      await userController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userDto = { id: 1, name: "Martim", email: "martim@example.com" } as UserDto;
      req.body = { name: "Martim", email: "martim@example.com", password: "pass", roleId: 1 };

      userService.createUser.mockResolvedValue(userDto);

      await userController.create(req as Request, res as Response);

      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "User created successfully", user: userDto });
    });

    it("should return 500 if creation fails", async () => {
      req.body = {};
      userService.createUser.mockRejectedValue(new Error("Erro"));

      await userController.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro" });
    });
  });

  describe("logout", () => {
    it("should clear cookies and return 200", async () => {
      jest.spyOn(authUtils, "clearAuthCookies").mockImplementation(jest.fn());

      await userController.logout(req as Request, res as Response);

      expect(authUtils.clearAuthCookies).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logout efetuado com sucesso" });
    });

    it("should return 500 if logout fails", async () => {
      jest.spyOn(authUtils, "clearAuthCookies").mockImplementation(() => { throw new Error("Erro logout"); });

      await userController.logout(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro logout" });
    });
  });

  describe("refreshToken", () => {
    it("should renew token and return user", async () => {
      req.cookies = { refresh_token: "validToken" };
      const decoded = { id: 1 };
      const userDto = { id: 1, name: "Martim", role: { id: 1 } } as UserDto;

      jest.spyOn(authUtils, "verifyRefreshToken").mockReturnValue(decoded);
      userService.getUserById.mockResolvedValue(userDto);
      jest.spyOn(authUtils, "generateAccessToken").mockReturnValue("newAccessToken");
      jest.spyOn(authUtils, "setAuthCookies").mockImplementation(jest.fn());

      await userController.refreshToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Token renovado", user: userDto });
    });

    it("should return 401 if no refresh token", async () => {
      req.cookies = {};

      await userController.refreshToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Refresh token não encontrado" });
    });

    it("should return 403 if token is invalid", async () => {
      req.cookies = { refresh_token: "invalid" };
      jest.spyOn(authUtils, "verifyRefreshToken").mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await userController.refreshToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Refresh token inválido ou expirado" });
    });

    it("should return 403 if unexpected error occurs", async () => {
      req.cookies = { refresh_token: "valid" };
      jest.spyOn(authUtils, "verifyRefreshToken").mockImplementation(() => { throw new Error("Erro inesperado"); });

      await userController.refreshToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Refresh token inválido ou expirado" });
    });
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      const users = [{ id: 1, name: "Martim" }];
      userService.getAllUsers.mockResolvedValue(users as any);

      await userController.getAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "List of all users", users });
    });

    it("should return 500 if getAllUsers fails", async () => {
      userService.getAllUsers.mockRejectedValue(new Error("Erro ao obter utilizadores"));

      await userController.getAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao obter utilizadores" });
    });
  });

  describe("getById", () => {
    it("should return user by id", async () => {
      const userDto = { id: 1, name: "Martim" } as UserDto;
      (req as any).user = { id: 1 };
      userService.getUserById.mockResolvedValue(userDto);

      await userController.getById(req as Request, res as Response);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User found by id", user: userDto });
    });

    it("should return 500 if getUserById fails", async () => {
      (req as any).user = { id: 1 };
      userService.getUserById.mockRejectedValue(new Error("Erro ao buscar utilizador"));

      await userController.getById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar utilizador" });
    });
  });

  describe("update", () => {
    it("should update the user name", async () => {
      const updatedUser = { id: 1, name: "Updated" } as UserDto;
      (req as any).user = { id: 1 };
      req.body = { name: "Updated" };
      userService.updateUser.mockResolvedValue(updatedUser);

      await userController.update(req as Request, res as Response);

      expect(userService.updateUser).toHaveBeenCalledWith(1, "Updated");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Username atualizado", user: updatedUser });
    });

    it("should return 500 if updateUser fails", async () => {
      (req as any).user = { id: 1 };
      req.body = { name: "Novo Nome" };
      userService.updateUser.mockRejectedValue(new Error("Erro ao atualizar utilizador"));

      await userController.update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erro ao atualizar utilizador" });
    });
  });

  describe("delete", () => {
    it("should delete the user and clear cookies", async () => {
      (req as any).user = { id: 1 };

      await userController.delete(req as Request, res as Response);

      expect(userService.deleteUser).toHaveBeenCalledWith(1);
      expect(res.clearCookie).toHaveBeenCalledWith("access_token");
      expect(res.clearCookie).toHaveBeenCalledWith("refresh_token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Conta apagada com sucesso" });
    });

    it("should return 500 if deleteUser fails", async () => {
      (req as any).user = { id: 1 };
      userService.deleteUser.mockRejectedValue(new Error("Erro interno"));

      await userController.delete(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erro ao apagar utilizador" });
    });
  });
  it("should return 404 if user not found after decoding token", async () => {
    req.cookies = { refresh_token: "validToken" };
    const decoded = { id: 99 };

    jest.spyOn(authUtils, "verifyRefreshToken").mockReturnValue(decoded);
    userService.getUserById.mockResolvedValue(null); // user inexistente

    await userController.refreshToken(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Utilizador não encontrado" });
  });
});
