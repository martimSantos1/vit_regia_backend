import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";

const SECRET = config.jwtSecret;

interface JwtPayload {
    id: number;
    name: string;
    email: string;
    roleId: string;
    iat?: number;
    exp?: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: "Authorization header missing" });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token missing" });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
};
