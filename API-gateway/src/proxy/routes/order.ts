import { Router } from 'express';
import { SERVICES } from '../../config/services';
import { makeProxy } from '../createProxy';
import { verifyJWT } from '../../middleware/auth';
import { requireRole, requireSelfOrAdmin } from '../../middleware/guards';
import { rateAdmin, rateAuth } from '../../middleware/rate';

export function orderRouter() {
    const r = Router();

    // CREATE ORDER  (USER or ADMIN)
    r.post('/orders', verifyJWT(), rateAuth(), makeProxy(SERVICES.order));

    //  USER or ADMIN: view own orders
    r.get('/orders/:email', verifyJWT(), requireSelfOrAdmin('email'), rateAuth(), makeProxy(SERVICES.order));

    //  ADMIN: view all orders
    r.get('/orders/admin/all-orders', verifyJWT(), requireRole('ADMIN'), rateAdmin(), makeProxy(SERVICES.order));

    //  Payment → update order status
    r.post('/orders/status', verifyJWT(), rateAuth(), makeProxy(SERVICES.order));

    return r;
}
