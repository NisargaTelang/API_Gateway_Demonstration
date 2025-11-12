import { Router } from 'express';
import { SERVICES } from '../../config/services';
import { makeProxy } from '../createProxy';
import { verifyJWT } from '../../middleware/auth';
import { rateAuth } from '../../middleware/rate';


export function paymentRouter() {
    const r = Router();
    r.post('/payments', verifyJWT(), rateAuth(), makeProxy(SERVICES.payment));
    r.get('/payments/pdf/:orderId', verifyJWT(), rateAuth(), makeProxy(SERVICES.payment));

    // Serve PDF files from payment service through gateway
    r.get('/payments/bills/:fileName', makeProxy(SERVICES.payment));

    r.use('/payments/bills', verifyJWT(), rateAuth(), makeProxy(SERVICES.payment));

    // alias version for your requirement
    r.get('/orderId', verifyJWT(), rateAuth(), makeProxy(SERVICES.payment));
    // REST path
    r.get('/payments/:orderId', verifyJWT(), rateAuth(), makeProxy(SERVICES.payment)); (SERVICES.payment);
    // You mentioned `GET /orderId` — we expose a RESTy path; add alias if needed:
    r.get('/payments/:orderId', verifyJWT(), rateAuth(), makeProxy(SERVICES.payment));
    return r;
}