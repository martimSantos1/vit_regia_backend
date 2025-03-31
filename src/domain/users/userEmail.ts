class UserEmail {
    private value: string;

    constructor(value: string) {
        if (!this.isValidEmail(value)) {
            throw new Error('O email fornecido não é válido');
        }
        this.value = value;
    }

    private isValidEmail(value: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(value);
    }

    getValue(): string {
        return this.value;
    }

    setValue(value: string): void {
        if (!this.isValidEmail(value)) {
            throw new Error('O email fornecido não é válido');
        }
        this.value = value;
    }
}
export default UserEmail;