import { RoleRepository } from "../../../infrastruture/repos/roleRepo";
import { Role } from "../../../domain/models/roles/role";

jest.mock("../../../loaders/sequelize", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import db from "../../../loaders/sequelize";

describe("RoleRepository", () => {
  let roleRepository: RoleRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      models: {
        Role: {
          create: jest.fn(),
          findAll: jest.fn(),
        },
      },
    };

    (db as jest.Mock).mockResolvedValue(mockDb);
    roleRepository = new RoleRepository();
  });

  describe("create", () => {
    it("should create a new role and return it", async () => {
      const input = { name: "Admin" };
      const mockCreatedRole = Object.assign(Object.create(Role.prototype), {
        id: 1,
        name: "Admin",
      });

      mockDb.models.Role.create.mockResolvedValue(mockCreatedRole);

      const result = await roleRepository.create(input);

      expect(mockDb.models.Role.create).toHaveBeenCalledWith(input);
      expect(result).toBeInstanceOf(Role);
      expect(result.name).toBe("Admin");
    });
  });

  describe("findAll", () => {
    it("should return a list of roles", async () => {
      const rolesData = [
        Object.assign(Object.create(Role.prototype), { id: 1, name: "Admin" }),
        Object.assign(Object.create(Role.prototype), { id: 2, name: "User" }),
      ];

      mockDb.models.Role.findAll.mockResolvedValue(rolesData);

      const result = await roleRepository.findAll();

      expect(mockDb.models.Role.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Role);
      expect(result[0].name).toBe("Admin");
      expect(result[1].name).toBe("User");
    });
  });
});