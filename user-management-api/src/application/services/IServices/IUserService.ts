import { User } from "../../../domain/entities/users/user";
import { UserDto } from "../../dto/userDTO";

export interface IUserService {
    login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; userDto: UserDto }>;
    createUser(user: { 
        name: string; 
        email: string; 
        password: string; 
        roleId: number }): Promise<UserDto>;
    deleteUser(id: number): Promise<void>;
    updateUser(id: number, name: string): Promise<UserDto | null>;
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<UserDto | null>;
}