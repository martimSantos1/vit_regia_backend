import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from '../../config.js';


const secretKey = config.jwtSecret as string; // Garantimos que a chave não é undefined

if (!secretKey) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

// Definição de um tipo customizado para adicionar "user" ao objeto Request
interface AuthenticatedRequest extends Request {
  user?: any; // Ajusta conforme a estrutura do payload do teu token JWT
}

const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).end();
    return;
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    console.log("decodedToken:", decodedToken);
    next();
  } catch (e) {
    console.error("Error verifying token:", e);
    res.status(401).end();
  }
};

export default isAuth;
