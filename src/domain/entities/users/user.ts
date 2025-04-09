import Role from '../roles/role';
import UserEmail from './userEmail';
import UserName from './userName';

class User {
    private id?: number;
    private name: UserName;
    private email: UserEmail;
    private password: string;
    private roleId: number;

    constructor(fullName: string, userName: string, email: string, password: string, roleId: number, id?: number) {
        this.name = new UserName(fullName, userName);
        this.email = new UserEmail(email);
        this.password = password;
        this.roleId = roleId;
        if (id) {
            this.id = id;
        }
    }

    getFullName(): string {
        return this.name.getFullName();
    }

    getUserName(): string {
        return this.name.getUserName();
    }

    getEmail(): string {
        return this.email.getEmail();
    }

    getPassword(): string {
        return this.password;
    }

    getRole(): number {
        return this.roleId;
    }

    setFullName(name: string): void {
        this.name.setFullName(name);
    }

    setUserName(name: string): void {
        this.name.setUserName(name);
    }

    setUserEmail(email: string): void {
        this.email.setEmail(email);
    }

    setRole(role: number): void {
        this.roleId = role;
    }

    setPassword(password: string): void {
        this.password = password;
    }
}

export default User;