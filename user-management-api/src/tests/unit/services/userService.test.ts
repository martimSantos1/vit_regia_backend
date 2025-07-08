import { UserService } from "../../../application/services/userService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRoleRepository } from "../../../domain/repositories/IRoleRepository";
import { User } from "../../../domain/models/users/user";
import HashingUtils from "../../../utils/hashingUtils";
import * as dtoUtils from "../../../application/dto/userDTO";
import * as authUtils from "../../../utils/authUtils";

jest.mock("../../../utils/hashingUtils", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
  comparePassword: jest.fn(),
}));

jest.mock("../../../application/dto/userDTO", () => ({
  toUserDto: jest.fn().mockImplementation((user) => ({ id: user.id, name: user.name })),
}));

jest.mock("../../../utils/authUtils", () => ({
  generateAccessToken: jest.fn().mockReturnValue("accessToken"),
  generateRefreshToken: jest.fn().mockReturnValue("refreshToken"),
}));

jest.mock("../../../utils/hashingUtils", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
  comparePassword: jest.fn(),
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

  // Login
  it("should login user successfully", async () => {
    const user = { id: 1, name: "Martim", password: "hashed" } as User;
    userRepository.findByEmail.mockResolvedValue(user);
    (HashingUtils.comparePassword as jest.Mock).mockResolvedValue(true);

    const result = await userService.login("martim@example.com", "pass");

    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      userDto: { id: 1, name: "Martim" },
    });
  });

  it("should throw if user not found during login", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(userService.login("fail@example.com", "pass")).rejects.toThrow("User not found");
  });

  it("should throw if password is invalid", async () => {
    const user = { id: 1, name: "Martim", password: "hashed" } as User;
    userRepository.findByEmail.mockResolvedValue(user);
    (HashingUtils.comparePassword as jest.Mock).mockResolvedValue(false);

    await expect(userService.login("martim@example.com", "wrong")).rejects.toThrow("Invalid password");
  });

  // createUser já está testado acima

  // updateUser
  it("should update user name successfully", async () => {
    const user = { id: 1, name: "Old" } as User;
    const savedUser = { id: 1, name: "New" } as User;
    userRepository.findById.mockResolvedValue(user);
    userRepository.findByUsername.mockResolvedValue(null);
    userRepository.save.mockResolvedValue(savedUser);

    const result = await userService.updateUser(1, "New");

    expect(result).toEqual({ id: 1, name: "New" });
  });

  it("should throw if user not found on update", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(userService.updateUser(1, "New")).rejects.toThrow("Erro ao atualizar utilizador: Utilizador não encontrado");
  });

  it("should throw if new name is same as current", async () => {
    userRepository.findById.mockResolvedValue({ id: 1, name: "Same" } as User);

    await expect(userService.updateUser(1, "Same")).rejects.toThrow("Erro ao atualizar utilizador: O nome deve ser diferente do atual");
  });

  it("should throw if name is already taken", async () => {
    userRepository.findById.mockResolvedValue({ id: 1, name: "Old" } as User);
    userRepository.findByUsername.mockResolvedValue({ id: 2, name: "New" } as User);

    await expect(userService.updateUser(1, "New")).rejects.toThrow("Erro ao atualizar utilizador: Nome de utilizador já está em uso");
  });

  // deleteUser
  it("should delete user if exists", async () => {
    userRepository.findById.mockResolvedValue({ id: 1 } as User);

    await userService.deleteUser(1);

    expect(userRepository.delete).toHaveBeenCalledWith(1);
  });

  it("should throw if user not found on delete", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(userService.deleteUser(1)).rejects.toThrow("Utilizador não encontrado");
  });

  // getAllUsers
  it("should return all users", async () => {
    const users = [{ id: 1 }, { id: 2 }] as User[];
    userRepository.findAll.mockResolvedValue(users);

    const result = await userService.getAllUsers();

    expect(result).toEqual(users);
  });

  // getUserById
  it("should return user dto by id", async () => {
    const user = { id: 1, name: "Martim" } as User;
    userRepository.findById.mockResolvedValue(user);

    const result = await userService.getUserById(1);

    expect(result).toEqual({ id: 1, name: "Martim" });
  });

  it("should throw if user not found by id", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(userService.getUserById(1)).rejects.toThrow("User not found");
  });

  // checkUserAlreadyExistsByEmail
  it("should return true if user exists by email", async () => {
    userRepository.findByEmail.mockResolvedValue({ email: "test@ex.com" } as User);

    const result = await userService.checkUserAlreadyExistsByEmail("test@ex.com");

    expect(result).toBe(true);
  });

  it("should return false if user does not exist by email", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const result = await userService.checkUserAlreadyExistsByEmail("test@ex.com");

    expect(result).toBe(false);
  });

  // checkUserAlreadyExistsByUserName
  it("should return true if user exists by name", async () => {
    userRepository.findByUsername.mockResolvedValue({ name: "martim" } as User);

    const result = await userService.checkUserAlreadyExistsByUserName("martim");

    expect(result).toBe(true);
  });

  it("should return false if user does not exist by name", async () => {
    userRepository.findByUsername.mockResolvedValue(null);

    const result = await userService.checkUserAlreadyExistsByUserName("martim");

    expect(result).toBe(false);
  });

  // createUser – sem roleId e sem roles no sistema
  it("should throw if no roles are available", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.findByUsername.mockResolvedValue(null);
    roleRepository.findAll.mockResolvedValue([]);

    await expect(userService.createUser({
      name: "Martim",
      email: "martim@example.com",
      password: "abc",
      roleId: undefined as unknown as number,
    })).rejects.toThrow("No roles available");
  });
});