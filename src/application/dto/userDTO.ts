export default class UserDTO {
    userName: string;
    email: string;
    password: string;
    roleId: number;

    constructor(user: { userName: string, email: string, password: string, roleId: number }) {
        this.userName = user.userName;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.roleId;
    }
}