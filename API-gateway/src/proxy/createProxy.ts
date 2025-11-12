import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Request, Response } from 'express';
import { ENV } from '../config/env';

export function makeProxy(target: string) {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        proxyTimeout: ENV.REQUEST_TIMEOUT_MS,
        timeout: ENV.REQUEST_TIMEOUT_MS,
        on: {
            error: (err, _req, res) => {
                // Type guard: Express Response vs raw socket
                const response = res as Response;

                if (typeof response.writeHead === 'function') {
                    response
                        .writeHead(502, { 'Content-Type': 'application/json' })
                        .end(
                            JSON.stringify({
                                error: {
                                    code: 'BAD_GATEWAY',
                                    message: 'Upstream service unavailable',
                                    details: err.message,
                                },
                            })
                        );
                } else {
                    try {
                        (res as any).end();
                    } catch { }
                }
            },
        },
    });
}
