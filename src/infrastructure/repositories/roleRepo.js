import db from '../database/db.js';

export class roleRepo {
    async findByName(name) {
        return await db.roles.findOne({ where: { name } });
    }

    async create(role) {
        return await db.roles.create(role);
    }
}