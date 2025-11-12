import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';
import { rateCheck } from '../config/rateLimit';


function tooMany(res: Response, retryAfter: number) {
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many requests', retryAfter } });
}


export function ratePublic() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = (req.ip || req.socket.remoteAddress || 'ip:unknown').toString();
        const key = `ip:${ip}`;
        const { allowed, retryAfter } = await rateCheck(key, ENV.PUBLIC_LIMIT_PER_MIN, ENV.RATE_WINDOW_SECONDS);
        if (!allowed) return tooMany(res, retryAfter);
        next();
    };
}


export function rateAuth() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const sub = req.user?.sub || 'anon';
        const key = `user:${sub}`;
        const { allowed, retryAfter } = await rateCheck(key, ENV.AUTH_LIMIT_PER_MIN, ENV.RATE_WINDOW_SECONDS);
        if (!allowed) return tooMany(res, retryAfter);
        next();
    };
}


export function rateAdmin() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const sub = req.user?.sub || 'anon';
        const key = `user:${sub}`;
        const { allowed, retryAfter } = await rateCheck(key, ENV.ADMIN_LIMIT_PER_MIN, ENV.RATE_WINDOW_SECONDS);
        if (!allowed) return tooMany(res, retryAfter);
        next();
    };
}