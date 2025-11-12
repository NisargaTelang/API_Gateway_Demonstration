import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { httpError } from './errors';


export type UserClaims = { sub: string; role: 'USER' | 'ADMIN'; email?: string };


declare global {
    namespace Express {
        interface Request { user?: UserClaims }
    }
}


export function verifyJWT(optional = false) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const auth = req.headers['authorization'];
        if (!auth) {
            if (optional) return next();
            return next(httpError(401, 'UNAUTHORIZED', 'Missing Authorization header'));
        }
        const m = /^Bearer\s+(.+)$/i.exec(auth);
        if (!m) return next(httpError(401, 'UNAUTHORIZED', 'Invalid Authorization header'));


        try {
            const payload = jwt.verify(m[1], ENV.JWT_SECRET, {
                algorithms: [ENV.JWT_ALG as jwt.Algorithm],
                issuer: ENV.JWT_ISS || undefined,
                audience: ENV.JWT_AUD || undefined,
            }) as any;
            req.user = { sub: payload.sub, role: payload.role, email: payload.email };
            // propagate to upstreams
            req.headers['x-user-id'] = String(payload.sub ?? '');
            req.headers['x-user-role'] = String(payload.role ?? '');
            if (payload.email) req.headers['x-user-email'] = String(payload.email);
            next();
        } catch (e: any) {
            return next(httpError(401, 'UNAUTHORIZED', 'Invalid or expired token'));
        }
    };
}