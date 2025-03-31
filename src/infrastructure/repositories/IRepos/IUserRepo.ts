import User from "../../../domain/users/user.js";

export default interface IUserRepo {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
}