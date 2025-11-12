import express from 'express';
import { corsMiddleware } from './config/cors';
import { requestId } from './middleware/requestId';
import { errorHandler } from './middleware/errors';
import { authRouter } from './proxy/routes/auth';
import { productRouter } from './proxy/routes/product';
import { paymentRouter } from './proxy/routes/payment';
import { orderRouter } from './proxy/routes/order';
import { verifyJWT } from './middleware/auth';

export function createServer() {
    const app = express();
    app.disable("x-powered-by");

    app.use(requestId);
    app.use(corsMiddleware);

    // ✅ global JSON parser — keep this, it was NOT the cause of your error
    // app.use(express.json({ limit: "5mb" }));

    // ✅ static files
    app.use("/files", express.static("/data"));

    // ✅ PUBLIC invoice PDFs (MUST be before JWT middleware)
    app.use("/payments/bills", express.static("/data/bills"));

    // ✅ health
    app.get("/health", (_req, res) => res.json({ status: "ok" }));

    // ✅ Public routes
    app.use("/auth", authRouter());
    app.use(productRouter());

    // ✅ everything below this requires token
    app.use(verifyJWT(false));

    // ✅ Protected routes
    app.use(paymentRouter());
    app.use(orderRouter());

    // ✅ Error handler
    app.use(errorHandler);

    return app;
}
