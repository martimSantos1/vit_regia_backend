class RoleName {
    private name: string;

    constructor(name: string) {
        if (!name || name.length < 3) {
            throw new Error('Nome da role deve ter pelo menos 3 caracteres');
        }
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        if (!name || name.length < 3) {
            throw new Error('Nome da role deve ter pelo menos 3 caracteres');
        }
        this.name = name;
    }
}
export default RoleName;