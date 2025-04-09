class RoleName {
    private name!: string;

    constructor(name: string) {
        this.setName(name);
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        if (!name || name.length < 3) {
            throw new Error('Nome da role deve ter pelo menos 3 caracteres');
        }
        if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
            throw new Error('A primeira letra do nome da role deve ser maiúscula');
        }
        this.name = name;
    }
}

export default RoleName;
