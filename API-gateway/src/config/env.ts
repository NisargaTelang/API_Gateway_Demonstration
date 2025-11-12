import 'dotenv/config';


function req(name: string, fallback?: string) {
    const v = process.env[name] ?? fallback;
    if (v === undefined) throw new Error(`Missing env: ${name}`);
    return v;
}


export const ENV = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: Number(process.env.PORT ?? 8080),


    JWT_ALG: req('JWT_ALG', 'HS256'),
    JWT_SECRET: req('JWT_SECRET'),
    JWT_ISS: process.env.JWT_ISS,
    JWT_AUD: process.env.JWT_AUD,


    AUTH_BASE: req('AUTH_BASE'),
    PRODUCT_BASE: req('PRODUCT_BASE'),
    PAYMENT_BASE: req('PAYMENT_BASE'),
    ORDER_BASE: req('ORDER_BASE'),


    CORS_ORIGINS: (process.env.CORS_ORIGINS ?? '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),


    REQUEST_TIMEOUT_MS: Number(process.env.REQUEST_TIMEOUT_MS ?? 8000),
    RETRY_ATTEMPTS: Number(process.env.RETRY_ATTEMPTS ?? 1),


    REDIS_URL: req('REDIS_URL', 'redis://redis:6379'),


    PUBLIC_LIMIT_PER_MIN: Number(process.env.PUBLIC_LIMIT_PER_MIN ?? 60),
    AUTH_LIMIT_PER_MIN: Number(process.env.AUTH_LIMIT_PER_MIN ?? 600),
    ADMIN_LIMIT_PER_MIN: Number(process.env.ADMIN_LIMIT_PER_MIN ?? 1200),
    RATE_WINDOW_SECONDS: Number(process.env.RATE_WINDOW_SECONDS ?? 60),
    RATE_ALGORITHM: (process.env.RATE_ALGORITHM ?? 'sliding') as 'sliding' | 'fixed',


    LOG_LEVEL: process.env.LOG_LEVEL ?? 'none',
};