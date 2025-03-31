// src/domain/Role.ts
import RoleName from './roleName.js';

class Role {
    id?: number;
    name: RoleName;

    constructor(name: string, id?: number) {
        this.name = new RoleName(name);
        if (id) {
            this.id = id;
        }
    }

    getRoleName(): string {
        return this.name.getName();
    }
}
export default Role;