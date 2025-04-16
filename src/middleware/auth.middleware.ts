import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header) {
        res.status(401).json({ message: 'Token necessário.' });
        return;
    }
    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = payload as any;
    } catch {
        res.status(401).json({ message: 'Token inválido.' });
        return;
    }

    next();
}
