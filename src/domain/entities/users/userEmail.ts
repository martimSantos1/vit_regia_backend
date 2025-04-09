class UserEmail {
    private email!: string;
    private static readonly EMAIL_REGEX = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;

    constructor(email: string) {
        this.setEmail(email);
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        if (!email || !UserEmail.EMAIL_REGEX.test(email)) {
            throw new Error('Email inválido');
        }
        this.email = email;
    }
}

export default UserEmail;