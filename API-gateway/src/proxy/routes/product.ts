import { Router } from 'express';
import { SERVICES } from '../../config/services';
import { makeProxy } from '../createProxy';
import { verifyJWT } from '../../middleware/auth';
import { requireRole } from '../../middleware/guards';
import { ratePublic, rateAdmin } from '../../middleware/rate';

export function productRouter() {
    const r = Router();

    // Everything under /products is OPEN GET
    r.get('/products', ratePublic(), makeProxy(SERVICES.product));
    r.get('/products/:id', ratePublic(), makeProxy(SERVICES.product));

    r.use('/files', makeProxy(SERVICES.product)); // SERVICES.product = http://product-service:8081

    // ADMIN routes
    r.post('/products', verifyJWT(), requireRole('ADMIN'), rateAdmin(), makeProxy(SERVICES.product));
    r.put('/products/:id', verifyJWT(), requireRole('ADMIN'), rateAdmin(), makeProxy(SERVICES.product));
    r.delete('/products/:id', verifyJWT(), requireRole('ADMIN'), rateAdmin(), makeProxy(SERVICES.product));

    return r;
}
