import { UserService } from "../../../application/services/userService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { User } from "../../../domain/models/users/user";
import HashingUtils from "../../../utils/hashingUtils";
import * as dtoUtils from "../../../application/dto/userDTO";

jest.mock("../../../utils/hashingUtils", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
}));

jest.mock("../../../application/dto/userDTO", () => ({
  toUserDto: jest.fn().mockImplementation((user) => ({ id: user.id, name: user.name })),
}));

describe("UserService", () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let roleRepository: jest.Mocked<IRoleRepository>;
  let userService: UserService;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    roleRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<IRoleRepository>;

    userService = new UserService(userRepository, roleRepository);
  });

  it("should create a new user successfully", async () => {
    const input = {
      name: "martim",
      email: "martim@example.com",
      password: "securePassword",
      roleId: 1,
    };

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.findByUsername.mockResolvedValue(null);

    const createdUser = Object.assign(Object.create(User.prototype), { id: 1, ...input });
    userRepository.create.mockResolvedValue(createdUser);

    const result = await userService.createUser(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.findByUsername).toHaveBeenCalledWith(input.name);
    expect(userRepository.create).toHaveBeenCalledWith({
      ...input,
      password: "hashedPassword",
    });
    expect(result).toEqual({ id: 1, name: "martim" }); // retorno do mock toUserDto
  });

  it("should throw error if required data is missing", async () => {
    await expect(userService.createUser({} as any)).rejects.toThrow("All fields are required");
  });

  it("should throw error if user already exists", async () => {
    userRepository.findByEmail.mockResolvedValue({ email: "martim@example.com" } as any);

    await expect(
      userService.createUser({
        name: "martim",
        email: "martim@example.com",
        password: "pass",
        roleId: 1,
      })
    ).rejects.toThrow("User already exists");
  });
});