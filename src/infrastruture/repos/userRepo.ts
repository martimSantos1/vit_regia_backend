import "reflect-metadata";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { injectable } from "tsyringe";
import db from "../../loaders/sequelize";
import User from "../../domain/entities/users/user";

@injectable()
export class UserRepository implements IUserRepository {
    async create(user: User): Promise<User> {
        const database = await db();
        const userData = await database.users.create({
            userName: user.getUserName(),
            fullName: user.getFullName(),
            email: user.getEmail(),
            password: user.getPassword(),
            roleId: user.getRole()
        });
        if (!userData) {
            throw new Error("User creation failed");
        }
        return user;
    }

    async findAll(): Promise<User[]> {
        const database = await db();
        const usersData = await database.users.findAll();
        return usersData.map((userData: any) =>
            new User(
                userData.userName,
                userData.fullName,
                userData.email,
                userData.password,
                userData.roleId,
                userData.id)
        );
    }

    async findById(id: number): Promise<User | null> {
        const database = await db();
        const userData = await database.users.findByPk(id);
        if (!userData) {
            return null;
        }
        return userData.map(new User(
            userData.userName,
            userData.fullName,
            userData.email,
            userData.password,
            userData.roleId,
            userData.id)
        );
    }

    async delete(userName: string): Promise<void> {
        const database = await db();
        await database.users.destroy({ where: { userName } });
    }

    async findByEmail(email: string): Promise<User | null> {
        const database = await db();
        const userData = await database.users.findOne({ where: { email } });
        if (!userData) {
            return null;
        }
        return userData.map(new User(
            userData.userName,
            userData.fullName,
            userData.email,
            userData.password,
            userData.roleId,
            userData.id)
        );    }

    async findByUsername(username: string): Promise<User | null> {
        const database = await db();
        const userData = await database.users.findOne({ where: { username } });
        if (!userData) {
            return null;
        }
        return userData.map(new User(
            userData.userName,
            userData.fullName,
            userData.email,
            userData.password,
            userData.roleId,
            userData.id)
        );    }
}