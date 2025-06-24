import { RoleRepository } from "../../../infrastruture/repos/roleRepo";
import Role from "../../../domain/models/roles/role";

jest.mock("../../../loaders/sequelize", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import db from "../../../loaders/sequelize";

describe("RoleRepository", () => {
  let roleRepository: RoleRepository;
  let mockDb: any;

  beforeEach(() => {
    roleRepository = new RoleRepository();

    mockDb = {
      roles: {
        create: jest.fn(),
        findAll: jest.fn(),
      },
    };

    (db as jest.Mock).mockResolvedValue(mockDb);
  });

  describe("create", () => {
    it("deve criar uma nova role e retornar a instância", async () => {
      const inputRole = new Role("Admin");
      const mockCreatedRole = { name: "Admin", id: 1 };

      mockDb.roles.create.mockResolvedValue(mockCreatedRole);

      const result = await roleRepository.create(inputRole);

      expect(mockDb.roles.create).toHaveBeenCalledWith({ name: "Admin" });
      expect(result).toBeInstanceOf(Role);
      expect(result.getRoleName()).toBe("Admin");
    });
  });

  describe("findAll", () => {
    it("deve retornar uma lista de roles", async () => {
      const rolesData = [
        { name: "Admin", id: 1 },
        { name: "User", id: 2 },
      ];

      mockDb.roles.findAll.mockResolvedValue(rolesData);

      const result = await roleRepository.findAll();

      expect(mockDb.roles.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Role);
      expect(result[0].getRoleName()).toBe("Admin");
      expect(result[1].getRoleName()).toBe("User");
    });
  });
});
