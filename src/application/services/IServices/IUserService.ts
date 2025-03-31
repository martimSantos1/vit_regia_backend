import UserDTO from "../../dto/userDTO.js";
import User from "../../../domain/users/user.js";

export default interface IUserService {
    register(userDTO: UserDTO): Promise<User>;
    login(email: string, password: string): Promise<User>;
}
