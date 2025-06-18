import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../utils/authUtils';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;
    if (!token) {
        res.status(401).json({ message: 'Access token missing' });
        return;
    }

    try {
        const decoded = verifyAccessToken(token);
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
    }
};
