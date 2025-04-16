import { Request, Response, NextFunction } from 'express';

export function authorize(role: 'ADMIN' | 'USER') {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (req.user.role !== role) {
            res.status(403).json({ message: 'Acesso negado.' });
            return;
        }
        next();
    };
}