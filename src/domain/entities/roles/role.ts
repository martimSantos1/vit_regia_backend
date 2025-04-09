import RoleName from './roleName';

class Role {
    private id?: number;
    private name: RoleName;

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