import { RoleController } from "../../../application/controllers/roleController";
import { IRoleService } from "../../../application/services/IServices/IRoleService";
import { Request, Response } from "express";
import { Role } from "../../../domain/models/roles/role";

// Mocks Express
const mockRequest = () => ({ body: {} } as Partial<Request>) as Request;
const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("RoleController", () => {
  let roleService: jest.Mocked<IRoleService>;
  let roleController: RoleController;

  beforeEach(() => {
    roleService = {
      createRole: jest.fn(),
      getAllRoles: jest.fn(),
    };
    roleController = new RoleController(roleService);
  });

  describe("create", () => {
    it("deve criar um novo role com sucesso", async () => {
      const req = mockRequest();
      req.body = { name: "Admin" };
      const res = mockResponse();

      const mockRole = Object.assign(Object.create(Role.prototype), {
        id: 1,
        name: "Admin",
      });

      roleService.createRole.mockResolvedValue(mockRole);

      await roleController.create(req, res);

      expect(roleService.createRole).toHaveBeenCalledWith("Admin");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockRole);
    });
  });

  describe("getAll", () => {
    it("deve retornar todas as roles", async () => {
      const req = mockRequest();
      const res = mockResponse();

      const mockRoles: Role[] = [
        Object.assign(Object.create(Role.prototype), { id: 1, name: "Admin" }),
        Object.assign(Object.create(Role.prototype), { id: 2, name: "User" }),
      ];

      roleService.getAllRoles.mockResolvedValue(mockRoles);

      await roleController.getAll(req, res);

      expect(roleService.getAllRoles).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockRoles);
    });
  });
  it("deve retornar 500 se ocorrer um erro ao criar o role", async () => {
    const req = mockRequest();
    req.body = { name: "Admin" };
    const res = mockResponse();

    const error = new Error("Erro ao criar role");
    roleService.createRole.mockRejectedValue(error);

    await roleController.create(req, res);

    expect(roleService.createRole).toHaveBeenCalledWith("Admin");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erro ao criar role" });
  });
  it("deve retornar 500 se ocorrer um erro ao buscar todas as roles", async () => {
    const req = mockRequest();
    const res = mockResponse();

    const error = new Error("Erro ao buscar roles");
    roleService.getAllRoles.mockRejectedValue(error);

    await roleController.getAll(req, res);

    expect(roleService.getAllRoles).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erro ao buscar roles" });
  });
});