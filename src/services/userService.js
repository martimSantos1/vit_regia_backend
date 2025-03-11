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
                roleId: userDTO.roleId
            });
            console.log("User created:", user);
            const token = this.#generateToken(user);
            return { user: new UserDTO(user), token };
        } catch (error) {
            console.log("Error in SignUp:", error);
            return null;
        }
    }

    async findUserById(id) {
        try {
            const user = await User.findByPk(id);
            return user;
        } catch (error) {
            console.log("Error in findUserById:", error);
            return null;
        }
    }

    async findUserByEmail(email) {
        try{
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            return user;
        } catch (error) {
            console.log("Error in findUserByEmail:", error);
            return null;
        }
    }

    async authenticateUser(email, password) {
        try {
            const user = await this.findUserByEmail(email);
            if (!user) {
                return null;
            }
            const isSame = await bcrypt.compare(password, user.password);
            if (isSame) {
                const token = this.#generateToken(user);
                return { user: new UserDTO(user), token };
            } else {
                return null;
            }
        } catch (error) {
            console.log("Error in authenticateUser:", error);
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
            role: user.role,
            exp: parseInt(exp.getTime() / 1000),
        }, process.env.secretKey);
    }
}