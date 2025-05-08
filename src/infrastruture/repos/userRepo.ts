import "reflect-metadata";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { injectable } from "tsyringe";
import database from "../../loaders/sequelize";
import { User } from "../../domain/entities/users/user";
import { CreationAttributes } from "sequelize";

@injectable()
export class UserRepository implements IUserRepository {
    async create(user: { name: string; email: string; password: string; roleId: number }): Promise<User> {
        const db = await database();
        const createdUser = await db.models.User.create(user as CreationAttributes<User>);
        return createdUser;
    }

    async findAll(): Promise<User[]> {
        const db = await database();
        return db.models.User.findAll({ include: ['role'] });
    }

    async findById(id: number): Promise<User | null> {
        const db = await database();
        return db.models.User.findByPk(id, { include: ['role'] });
    }

    async delete(name: string): Promise<void> {
        const db = await database();
        await db.models.User.destroy({ where: { name } });
    }

    async findByEmail(email: string): Promise<User | null> {
        const db = await database();
        return db.models.User.findOne({ where: { email }, include: ['role'] });
    }

    async findByUsername(name: string): Promise<User | null> {
        const db = await database();
        return db.models.User.findOne({ where: { name }, include: ['role'] });
    }
}