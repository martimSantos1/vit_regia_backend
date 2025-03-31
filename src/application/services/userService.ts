import UserDTO from "../../application/dto/userDTO.js";
import hashingUtils from "../../utils/hashingUtils.js";
import User from "../../domain/users/user.js";
import IUserService from "../services/IServices/IUserService.js";
import IUserRepo from "../../infrastructure/repositories/IRepos/IUserRepo.js";
import IRoleRepo from "../../infrastructure/repositories/IRepos/IRoleRepo.js";

import { Inject, Service } from "typedi";
import config from "./../../config.js";


@Service()
export default class UserService implements IUserService {
    constructor(
        @Inject(config.repos.user.name) private userRepo: IUserRepo,
        @Inject(config.repos.role.name) private roleRepo: IRoleRepo
    ){}

    async register(userDTO: UserDTO): Promise<User> {
        const existingUser = await this.userRepo.findByEmail(userDTO.email);
        if (existingUser) throw new Error("⚠️ Já existe uma conta com este email!");

        const hashedPassword = await hashingUtils.hashPassword(userDTO.password);
        
        const existingRole = await this.roleRepo.findById(userDTO.roleId);
        if (!existingRole) throw new Error("⚠️ O cargo especificado não existe!");

        const newUser = new User(userDTO.userName, userDTO.email, hashedPassword, existingRole, undefined);
        return await this.userRepo.create(newUser);
    }

    async login(email: string, password: string): Promise<User> {
        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new Error("⚠️ Não existe uma conta com este email!");

        const isPasswordValid = await hashingUtils.comparePassword(password, user.password.getValue());
        if (!isPasswordValid) throw new Error("⚠️ Palavra-passe inválida!");
        return user;
    }
}
