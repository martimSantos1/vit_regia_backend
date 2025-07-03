// src/tests/integration/role.integration.test.ts
import "reflect-metadata";
import express, { Express } from "express";
import request from "supertest";
import { container } from "tsyringe";
import role from "../../api/index";
import { IRoleRepository } from "../../../src/domain/repositories/IRoleRepository";
import { Role } from "../../../src/domain/models/roles/role";
import { RoleService } from "../../../src/application/services/roleService";

const mockRoleRepository: jest.Mocked<IRoleRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
};

let app: Express;

beforeAll(() => {
  app = express();
  app.use(express.json());

  container.registerInstance<IRoleRepository>("RoleRepository", mockRoleRepository);
  container.register("RoleService", { useClass: RoleService });

  // mocks para que o userRoute não cause erro
  class MockUserService {}
  class MockUserRepository {}

  container.register("UserService", { useClass: MockUserService });
  container.register("UserRepository", { useClass: MockUserRepository });

  // aplica o router principal criado em src/api/index.ts
  app.use("/api", role());
});


beforeEach(() => {
  jest.clearAllMocks();
});

describe("Role Integration Test (Controller + Service)", () => {
  it("should create a new role", async () => {
    mockRoleRepository.findAll.mockResolvedValue([]); // nenhuma role existente
    mockRoleRepository.create.mockResolvedValue({ id: 1, name: "Admin" } as Role);

    const res = await request(app)
      .post("/api/roles/create")
      .send({ name: "Admin" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, name: "Admin" });
  });

  it("should return all roles", async () => {
    const roles = [
      { id: 1, name: "Admin" },
      { id: 2, name: "User" },
    ] as Role[];

    mockRoleRepository.findAll.mockResolvedValue(roles);

    const res = await request(app).get("/api/roles/all");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(roles);
  });
});