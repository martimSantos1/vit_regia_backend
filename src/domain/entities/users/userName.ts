class UserName {
    private fullName!: string;
    private userName!: string;
    private static readonly USER_NAME_MIN_LENGTH = 3;
    private static readonly USER_NAME_MAX_LENGTH = 20;
    private static readonly USER_NAME_REGEX = /^[a-zA-Z0-9]+$/;
    private static readonly FULL_NAME_REGEX = /^[a-zA-Z]+$/;

    constructor(fullName: string, userName: string) {
        this.setFullName(fullName);
    }

    getFullName(): string {
        return this.fullName;
    }

    setFullName(name: string): void {
        if (!name || name.length < UserName.USER_NAME_MIN_LENGTH) {
            throw new Error('O nome próprio deve ter mais de ' + UserName.USER_NAME_MIN_LENGTH + ' caracteres');
        }
        if (!UserName.FULL_NAME_REGEX.test(name)) {
            throw new Error('O nome próprio só pode conter letras');
        }
        this.fullName = name;
    }

    getUserName(): string {
        return this.userName;
    }

    setUserName(name: string): void {
        if (!name || name.length < UserName.USER_NAME_MIN_LENGTH || name.length > UserName.USER_NAME_MAX_LENGTH) {
            throw new Error('O nome de utilizador deve ter entre ' + UserName.USER_NAME_MIN_LENGTH + ' e ' + UserName.USER_NAME_MAX_LENGTH + ' caracteres');
        }
        if (!UserName.USER_NAME_REGEX.test(name)) {
            throw new Error('O nome de utilizador só pode conter letras e números');
        }
        this.userName = name;
    }
}

export default UserName;