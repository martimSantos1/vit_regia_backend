import { User } from "../models/users/user";

export interface IUserRepository {
    create(user: {
        name: string;
        email: string;
        password: string;
        roleId: number;
    }): Promise<User>;

    save(user: Partial<User> & { id: number }): Promise<User>;

    findAll(): Promise<User[]>;

    findById(id: number): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    findByUsername(name: string): Promise<User | null>;

    delete(id: number): Promise<void>;
}