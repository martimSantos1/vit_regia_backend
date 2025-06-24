import { RoleService } from "../../../application/services/roleService";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import Role from "../../../domain/models/roles/role";

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

  it("Deve criar um novo role com sucesso", async () => {
    roleRepository.findAll.mockResolvedValue([]);
    const expectedRole = new Role("Admin");
    roleRepository.create.mockResolvedValue(expectedRole);

    const result = await roleService.createRole("Admin");

    expect(roleRepository.findAll).toHaveBeenCalled();
    expect(roleRepository.create).toHaveBeenCalledWith(expect.any(Role));
    expect(result).toEqual(expectedRole);
  });

  it("Deve lançar erro se o nome do role não for fornecido", async () => {
    await expect(roleService.createRole("")).rejects.toThrow("Role name is required");
    expect(roleRepository.findAll).not.toHaveBeenCalled();
    expect(roleRepository.create).not.toHaveBeenCalled();
  });

  it("Não deve criar uma role com nome iniciado por letra minúscula", async () => {
    roleRepository.findAll.mockResolvedValue([]);

    await expect(roleService.createRole("admin")).rejects.toThrow(
      "A primeira letra do nome da role deve ser maiúscula"
    );
    expect(roleRepository.create).not.toHaveBeenCalled();
  });

  it("Deve lançar erro se o role já existir", async () => {
    const existingRole = new Role("Admin");
    jest.spyOn(existingRole, "getRoleName").mockReturnValue("Admin");
    roleRepository.findAll.mockResolvedValue([existingRole]);

    await expect(roleService.createRole("admin")).rejects.toThrow("Role already exists");

    expect(roleRepository.findAll).toHaveBeenCalled();
    expect(roleRepository.create).not.toHaveBeenCalled();
  });

  it("Deve retornar todos os roles", async () => {
    const roles = [new Role("Admin"), new Role("User")];
    roleRepository.findAll.mockResolvedValue(roles);

    const result = await roleService.getAllRoles();

    expect(roleRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(roles);
  });
});
