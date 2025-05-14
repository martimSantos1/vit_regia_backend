import { RoleController } from "../../../application/controllers/roleController";
import { IRoleService } from "../../../application/services/IServices/IRoleService";
import { Request, Response } from "express";

// Mocks do Express
const mockRequest = () => ({ body: {} } as Partial<Request>) as Request;
const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnValue(res); // permite encadear res.status(...).json(...)
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

      const fakeRole = { getRoleName: () => "Admin" };
      roleService.createRole.mockResolvedValue(fakeRole as any);

      await roleController.create(req, res);

      expect(roleService.createRole).toHaveBeenCalledWith("Admin");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeRole);
    });

    it("deve retornar erro 500 em caso de falha", async () => {
      const req = mockRequest();
      req.body = { name: "Admin" };
      const res = mockResponse();

      roleService.createRole.mockRejectedValue(new Error("Erro de criação"));

      await roleController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erro de criação" });
    });
  });

  describe("getAll", () => {
    it("deve retornar todos os roles com sucesso", async () => {
      const req = mockRequest();
      const res = mockResponse();

      const roles = [{ getRoleName: () => "Admin" }, { getRoleName: () => "User" }];
      roleService.getAllRoles.mockResolvedValue(roles as any);

      await roleController.getAll(req, res);

      expect(roleService.getAllRoles).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(roles);
    });

    it("deve retornar erro 500 em caso de falha", async () => {
      const req = mockRequest();
      const res = mockResponse();

      roleService.getAllRoles.mockRejectedValue(new Error("Erro ao buscar roles"));

      await roleController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erro ao buscar roles" });
    });
  });
});
