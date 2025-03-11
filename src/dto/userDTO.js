export default class UserDTO {
    constructor(user) {
        this.userName = user.userName;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.roleId;
    }
}
console.log("UserDTO module loaded");