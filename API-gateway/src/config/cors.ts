import cors from 'cors';
import { ENV } from './env';


export const corsMiddleware = cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (ENV.CORS_ORIGINS.length === 0) return cb(null, true);
        if (ENV.CORS_ORIGINS.includes(origin)) return cb(null, true);
        cb(null, false);
    },
    credentials: false,
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
});