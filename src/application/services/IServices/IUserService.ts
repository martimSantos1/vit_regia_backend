import { User } from "../../../domain/entities/users/user";

export interface IUserService {
    createUser(user: { 
        name: string; 
        email: string; 
        password: string; 
        roleId: number }): Promise<User>;
    getAllUsers(): Promise<User[]>;
}