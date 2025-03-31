class UserPassword {
    private value: string;

    constructor(value: string) {
        if (!this.isValidPassword(value)) {
            throw new Error('A senha fornecida não é segura o suficiente');
        }
        this.value = value;
    }

    private isValidPassword(value: string): boolean {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        // A senha deve ter pelo menos 8 caracteres, incluir uma letra e um número
        return passwordRegex.test(value);
    }

    getValue(): string {
        return this.value;
    }

    setValue(value: string): void {
        if (!this.isValidPassword(value)) {
            throw new Error('A senha fornecida não é segura o suficiente');
        }
        this.value = value;
    }
}
export default UserPassword;