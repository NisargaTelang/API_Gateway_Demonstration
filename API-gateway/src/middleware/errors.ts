import { Request, Response, NextFunction } from 'express';


export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    const status = err.status || err.statusCode || 500;
    const code = err.code || 'INTERNAL_ERROR';
    const message = err.message || 'Unexpected error';
    res.status(status).json({ error: { code, message } });
}


export function httpError(status: number, code: string, message: string) {
    const e: any = new Error(message);
    e.status = status; e.code = code; return e;
}