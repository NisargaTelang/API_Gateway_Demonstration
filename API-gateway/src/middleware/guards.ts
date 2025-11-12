import { Request, Response, NextFunction } from 'express';
import { httpError } from './errors';


export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    if (!req.user) return next(httpError(401, 'UNAUTHORIZED', 'Authentication required'));
    next();
}


export function requireRole(role: 'ADMIN') {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) return next(httpError(401, 'UNAUTHORIZED', 'Authentication required'));
        if (req.user.role !== role) return next(httpError(403, 'FORBIDDEN', 'Insufficient role'));
        next();
    };
}


export function requireSelfOrAdmin(paramKey: string) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) return next(httpError(401, 'UNAUTHORIZED', 'Authentication required'));
        const value = req.params[paramKey];
        if (req.user.role === 'ADMIN') return next();
        if (req.user.email && value && req.user.email === value) return next();
        return next(httpError(403, 'FORBIDDEN', 'Not allowed for other users'));
    };
}