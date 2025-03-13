import UserDTO from "../../application/dto/userDTO.js";
// import jwt from "jsonwebtoken";
import { userRepo } from "../../infrastructure/repositories/userRepo.js";
import hashingUtils from "../../utils/hashingUtils.js";
import User from "../../domain/entities/user.js";

console.log("UserDTO imported:", UserDTO);

export default class UserService {
    constructor() {
        this.userRepo = new userRepo();
    }

    async register(userDTO) {
        const existingUser = await this.userRepo.findByEmail(userDTO.email);
        if (existingUser) throw new Error("⚠️ Já existe uma conta com este email!");

        const hashedPassword = await hashingUtils.hashPassword(userDTO.password);
        const newUser = new User(null, userDTO.userName, userDTO.email, hashedPassword, userDTO.roleId);
        return await this.userRepo.create(newUser);
    }

    async login(email, password) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new Error("⚠️ Não existe uma conta com este email!");

        const isPasswordValid = await hashingUtils.comparePassword(password, user.password);
        if (!isPasswordValid) throw new Error("⚠️ Palavra-passe inválida!");

        // Gerar token JWT (descomentando se necessário)
        // const token = this.#generateToken(user);
        // return { user, token };

        return user;
    }

    // #generateToken(user) {
    //     const today = new Date();
    //     const exp = new Date(today);
    //     exp.setDate(today.getDate() + 60);
    //     return jwt.sign({
    //         id: user.id,
    //         userName: user.userName,
    //         email: user.email,
    //         role: user.role,
    //         exp: parseInt(exp.getTime() / 1000),
    //     }, process.env.secretKey);
    // }
}