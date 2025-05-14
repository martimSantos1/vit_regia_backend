import { User } from "../entities/users/user";

export interface IUserRepository {
    create(user: {
        name: string;
        email: string;
        password: string;
        roleId: number;
    }): Promise<User>;

    findAll(): Promise<User[]>;

    findById(id: number): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    findByUsername(name: string): Promise<User | null>;

    delete(name: string): Promise<void>;
}