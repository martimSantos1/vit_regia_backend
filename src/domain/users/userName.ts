class UserName {
    private name: string;

    constructor(name: string) {
        if (!name || name.length < 3) {
            throw new Error('O nome de usuário deve ter pelo menos 3 caracteres');
        }
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        if (!name || name.length < 3) {
            throw new Error('O nome de usuário deve ter pelo menos 3 caracteres');
        }
        this.name = name;
    }
}
export default UserName;