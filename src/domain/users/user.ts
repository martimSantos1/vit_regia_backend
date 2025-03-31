// src/domain/User.ts
import UserName from './userName.js';
import Email from './userEmail.js';
import Password from './userPassword.js';
import Role from '../roles/role.js';

class User {
    userName: UserName;  // Instância da classe UserName
    email: Email;        // Instância da classe Email
    password: Password;  // Instância da classe Password
    role: Role;
    id?: number;

    constructor(userName: string, email: string, password: string, role: Role, id?: number) {
        this.userName = new UserName(userName);
        this.email = new Email(email);
        this.password = new Password(password);
        this.role = role;
        if (id) {
            this.id = id;
        }
    }

    getUserName(): string {
        return this.userName.getName();
    }

    setUserName(userName: string): void {
        this.userName.setName(userName);
    }

    getEmail(): string {
        return this.email.getValue();
    }

    setEmail(email: string): void {
        this.email.setValue(email);
    }

    getPassword(): string {
        return this.password.getValue();
    }

    setPassword(password: string): void {
        this.password.setValue(password);
    }
}
export default User;