import User from "../entities/users/user";

export interface IUserRepository{
    create(data: User): Promise<User>;
    findAll(): Promise<User[]>;
}