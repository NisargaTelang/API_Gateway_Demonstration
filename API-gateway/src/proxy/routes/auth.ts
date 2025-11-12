import { Router } from 'express';
import { makeProxy } from '../createProxy';

export function authRouter() {
    const r = Router();

    r.use('/', makeProxy(process.env.AUTH_BASE!));

    return r;
}
