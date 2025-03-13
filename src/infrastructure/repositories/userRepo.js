import db from '../database/db.js';

export class userRepo {
    async findById(id) {
        return await db.users.findByPk(id);
    }

    async findByEmail(email) {
        return await db.users.findOne({ where: { email } });
    }

    async create(user) {
        return await db.users.create(user);
    }

    async update(id, user) {
        return await db.users.save(user, { where: { id } });
    }
}
