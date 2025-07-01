import { RoleService } from "../../../application/services/roleService";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { Role } from "../../../domain/models/roles/role";

describe("RoleService", () => {
  let roleRepository: jest.Mocked<IRoleRepository>;
  let roleService: RoleService;

  beforeEach(() => {
    roleRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
    };
    roleService = new RoleService(roleRepository);
  });

  it("should create a new role successfully", async () => {
    roleRepository.findAll.mockResolvedValue([]);

    const createdRole = Object.assign(Object.create(Role.prototype), {
      id: 1,
      name: "Admin",
    });

    roleRepository.create.mockResolvedValue(createdRole);

    const result = await roleService.createRole("Admin");

    expect(roleRepository.findAll).toHaveBeenCalled();
    expect(roleRepository.create).toHaveBeenCalledWith({ name: "Admin" });
    expect(result).toEqual(createdRole);
  });

  it("should throw error if role name is empty", async () => {
    await expect(roleService.createRole("")).rejects.toThrow("Role name is required");
  });

  it("should throw error if role already exists", async () => {
    const existingRole = Object.assign(Object.create(Role.prototype), {
      id: 1,
      name: "Admin",
    });

    roleRepository.findAll.mockResolvedValue([existingRole]);

    await expect(roleService.createRole("Admin")).rejects.toThrow("Role already exists");
  });
});
