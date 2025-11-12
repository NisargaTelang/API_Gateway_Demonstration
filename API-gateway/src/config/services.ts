import { ENV } from './env';

export const SERVICES = {
    auth: process.env.AUTH_BASE!,    // http://auth-service:8080/auth
    product: process.env.PRODUCT_BASE!, // http://product-service:8081
    payment: process.env.PAYMENT_BASE!, // http://payment-service:8083
    order: process.env.ORDER_BASE!,   // http://order-service:8082
};
