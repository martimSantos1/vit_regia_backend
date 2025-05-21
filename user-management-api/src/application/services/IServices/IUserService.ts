import { User } from "../../../domain/entities/users/user";

export interface IUserService {
    login(email: string, password: string): Promise<string>;
    createUser(user: { 
        name: string; 
        email: string; 
        password: string; 
        roleId: number }): Promise<User>;
    getAllUsers(): Promise<User[]>;
}