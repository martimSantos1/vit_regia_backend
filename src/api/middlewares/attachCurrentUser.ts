import { Request, Response, NextFunction } from "express";
import config from "../../config.js";
import winston from "winston";
import { Container } from "typedi";
import IUserRepo from "../../infrastructure/repositories/IRepos/IUserRepo.js";

// Definição de um tipo customizado para adicionar "user" ao objeto Request
interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Ajusta a tipagem conforme a estrutura real do usuário
}

const attachCurrentUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const Logger = Container.get('logger') as winston.Logger;
  try {
    const userRepo = Container.get(config.repos.user.name) as IUserRepo;


    if (!req.user || !req.user.id) {
      res.status(401).end();
      return;
    }

    const user = await userRepo.findById(parseInt(req.user.id));
    if (!user || !user.id) {
      res.status(401).end();
      return;
    }
    req.user = { id: user.id.toString() };
    next();
  } catch (e) {
    console.error("Error attaching user to req:", e);
    res.status(500).end();
  }
};

export default attachCurrentUser;
