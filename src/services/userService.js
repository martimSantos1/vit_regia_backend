import UserDTO from "../dto/userDTO.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../schemas/index.js";
const User = db.users;

console.log("UserDTO imported:", UserDTO);

export default class UserService {
    async SignUp(userDTO) {
        try {
            console.log("UserDTO in SignUp:", userDTO);
            if (!userDTO.password) {
                throw new Error("Password is required");
            }
            const hashedPassword = bcrypt.hashSync(userDTO.password, 8);
            const user = await User.create({
                userName: userDTO.userName,
                email: userDTO.email,
                password: hashedPassword,
            });
            console.log("User created:", user);
            const token = this.#generateToken(user);
            return { user: new UserDTO(user), token };
        } catch (error) {
            console.log("Error in SignUp:", error);
            return null;
        }
    }

    #generateToken(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
        return jwt.sign({
            id: user.id,
            userName: user.userName,
            email: user.email,
            exp: parseInt(exp.getTime() / 1000),
        }, process.env.secretKey);
    }
}