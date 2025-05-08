import "reflect-metadata";
import { IUserService } from './IServices/IUserService';
import { injectable, inject } from 'tsyringe';
import { User } from '../../domain/entities/users/user';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRoleRepository } from "../../domain/repositories/IRoleRepository";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject('UserRepository') private userRepository: IUserRepository,
        @inject('RoleRepository') private roleRepository: IRoleRepository
    ) { }

    async createUser(user: { name: string; email: string; password: string; roleId: number }): Promise<User> {
        if (!user.name || !user.email || !user.password) {
            throw new Error('All fields are required');
        }
        const existingUsers = await this.userRepository.findAll();
        const userExists = existingUsers.some((existingUser) => existingUser.email.toLowerCase() === user.email.toLowerCase());
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
        const createdUser = await this.userRepository.create(user);
        return createdUser;
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }
}