import User from '../../domain/users/user.js';
import db from '../../loaders/sequelize.js';

import { Service } from 'typedi';

@Service()
export default class userRepo {
    async findById(id: number): Promise<User | null> {
        const database = await db();
        const userData = await database.users.findByPk(id);
        if (!userData) {
            return null;
        }
        const existingRole = await database.roles.findByPk(userData.roleId);
        return new User(userData.userName, userData.email, userData.password, existingRole, userData.id);
    }

    async findByEmail(email: string): Promise<User | null> {
        const database = await db();
        const userData = await database.users.findOne({ where: { email } });
        if (!userData) {
            return null;
        }
        const existingRole = await database.roles.findByPk(userData.roleId);
        return new User(userData.userName, userData.email, userData.password, existingRole, userData.id);
    }

    async create(user: User): Promise<User> {
        const database = await db();
        const userData = await database.users.create({
            userName: user.userName.getName(),
            email: user.email.getValue(),
            password: user.password.getValue(),
            roleId: user.role.id,
        });
        return new User(userData.userName, userData.email, userData.password, userData.roleId, userData.id);
    }
}
