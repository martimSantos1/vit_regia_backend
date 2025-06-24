import "reflect-metadata";
import { IUserService } from './IServices/IUserService';
import { injectable, inject } from 'tsyringe';
import { User } from '../../domain/models/users/user';
import { UserDto, toUserDto } from "../dto/userDTO";
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRoleRepository } from "../../domain/repositories/IRoleRepository";
import { generateAccessToken, generateRefreshToken } from "../../utils/authUtils";
import HashingUtils from "../../utils/hashingUtils";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject('UserRepository') private userRepository: IUserRepository,
        @inject('RoleRepository') private roleRepository: IRoleRepository
    ) { }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; userDto: UserDto }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('User not found');

        const isPasswordValid = await HashingUtils.comparePassword(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid password');

        const userDto = await toUserDto(user);

        const accessToken = generateAccessToken(userDto);
        const refreshToken = generateRefreshToken(userDto);

        return { accessToken, refreshToken, userDto };
    }

    async createUser(user: { name: string; email: string; password: string; roleId: number }): Promise<UserDto> {
        if (!user.name || !user.email || !user.password) {
            throw new Error('All fields are required');
        }

        const userExistsByEmail = await this.checkUserAlreadyExistsByEmail(user.email);
        const userExistsByUserName = await this.checkUserAlreadyExistsByUserName(user.name);

        if (userExistsByEmail || userExistsByUserName) {
            throw new Error('User already exists');
        }

        if (!user.roleId) {
            const roles = await this.roleRepository.findAll();
            if (roles.length > 0) {
                user.roleId = roles[0].id;
            } else {
                throw new Error('No roles available');
            }
        }

        user.password = await HashingUtils.hashPassword(user.password);

        const createdUser = await this.userRepository.create(user);
        if (!createdUser) {
            throw new Error('Error creating user');
        }

        const userDto = await toUserDto(createdUser);

        return userDto;
    }

    async updateUser(id: number, name: string): Promise<UserDto | null> {
        try {
            const userFound = await this.userRepository.findById(id);
            if (!userFound) {
                throw new Error('Utilizador não encontrado');
            }
            if (userFound.name == name) {
                throw new Error('O nome deve ser diferente do atual');
            }
            const nameAlreadyTaken = await this.checkUserAlreadyExistsByUserName(name);
            if (nameAlreadyTaken) {
                throw new Error('Nome de utilizador já está em uso');
            }
            userFound.name = name;
            const result = await this.userRepository.save(userFound);
            return toUserDto(result);
        } catch (error: any) {
            throw new Error('Erro ao atualizar utilizador: ' + error.message);
        }
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) throw new Error('Utilizador não encontrado');
        await this.userRepository.delete(id);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async getUserById(id: number): Promise<UserDto | null> {
        const userFound = await this.userRepository.findById(id);
        if (!userFound) throw new Error('User not found');

        const user = await toUserDto(userFound);

        return user;
    }

    async checkUserAlreadyExistsByEmail(email: string): Promise<boolean> {
        const existingUser = await this.userRepository.findByEmail(email);
        return !!existingUser && existingUser.email.toLowerCase() === email.toLowerCase();
    }

    async checkUserAlreadyExistsByUserName(name: string): Promise<boolean> {
        const existingUser = await this.userRepository.findByUsername(name);
        return !!existingUser && existingUser.name.toLowerCase() === name.toLowerCase();
    }
}