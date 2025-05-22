import "reflect-metadata";
import { IUserService } from './IServices/IUserService';
import { injectable, inject } from 'tsyringe';
import { User } from '../../domain/entities/users/user';
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

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('User not found');

        const isPasswordValid = await HashingUtils.comparePassword(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid password');

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            roleId: user.roleId
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return { accessToken, refreshToken };
    }

    async createUser(user: { name: string; email: string; password: string; roleId: number }): Promise<UserDto> {
        if (!user.name || !user.email || !user.password) {
            throw new Error('All fields are required');
        }

        const existingUsers = await this.userRepository.findAll();
        const userExists = existingUsers.some((existingUser) =>
            existingUser.email.toLowerCase() === user.email.toLowerCase() ||
            existingUser.name.toLowerCase() === user.name.toLowerCase()
        );

        if (userExists) {
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

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async getUserById(id: number): Promise<UserDto | null> {
        const userFound = await this.userRepository.findById(id);
        if (!userFound) throw new Error('User not found');
        
        const user = await toUserDto(userFound);

        return user;
    }
}