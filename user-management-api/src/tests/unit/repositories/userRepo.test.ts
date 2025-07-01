import { UserRepository } from "../../../infrastruture/repos/userRepo";
import { User } from "../../../domain/models/users/user";

jest.mock("../../../loaders/sequelize", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import db from "../../../loaders/sequelize";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      models: {
        User: {
          create: jest.fn(),
          findAll: jest.fn(),
        },
      },
    };
    (db as jest.Mock).mockResolvedValue(mockDb);
    userRepository = new UserRepository();
  });

  describe("create", () => {
    it("should create a new user and return it", async () => {
      const input = {
        name: "martim",
        email: "1210704@isep.ipp.pt",
        password: "hashedPassword",
        roleId: 1,
      };
      const mockCreated = Object.assign(Object.create(User.prototype), {
        id: 1,
        ...input,
      });

      mockDb.models.User.create.mockResolvedValue(mockCreated);

      const result = await userRepository.create(input);

      expect(mockDb.models.User.create).toHaveBeenCalledWith(input);
      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe("martim");
    });
  });

  describe("findAll", () => {
    it("should return a list of users", async () => {
      const usersData = [
        Object.assign(Object.create(User.prototype), { id: 1, name: "martim" }),
        Object.assign(Object.create(User.prototype), { id: 2, name: "catarina" }),
      ];

      mockDb.models.User.findAll.mockResolvedValue(usersData);

      const result = await userRepository.findAll();

      expect(mockDb.models.User.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[0].name).toBe("martim");
    });
  });
});