import Redis from 'ioredis';
import { ENV } from './env';


export const redis = new Redis(ENV.REDIS_URL);


export type RateDecision = {
    allowed: boolean;
    remaining: number;
    retryAfter: number; // seconds
};


export async function rateCheck(key: string, limit: number, windowSec: number): Promise<RateDecision> {
    const now = Date.now();
    const windowStart = Math.floor(now / 1000 / windowSec) * windowSec;


    if (ENV.RATE_ALGORITHM === 'fixed') {
        const bucketKey = `rl:${key}:${windowStart}`;
        const count = await redis.incr(bucketKey);
        if (count === 1) await redis.expire(bucketKey, windowSec);
        const allowed = count <= limit;
        const ttl = await redis.ttl(bucketKey);
        return { allowed, remaining: Math.max(0, limit - count), retryAfter: ttl < 0 ? windowSec : ttl };
    }


    // Sliding window (naive: ZSET of timestamps)
    const zkey = `rl:${key}`;
    const min = now - windowSec * 1000;
    await redis.zremrangebyscore(zkey, 0, min);
    const tx = redis.multi();
    tx.zadd(zkey, now, `${now}`);
    tx.zcard(zkey);
    tx.expire(zkey, windowSec);
    const [, card] = (await tx.exec()) as any[];
    const count = Number(card[1] ?? card[0]);
    const allowed = count <= limit;
    // Approx retry: when next event outside window
    const oldest = await redis.zrange(zkey, 0, 0, 'WITHSCORES');
    const oldestScore = Number(oldest?.[1] ?? now);
    const retryAfter = Math.max(0, Math.ceil((oldestScore + windowSec * 1000 - now) / 1000));
    return { allowed, remaining: Math.max(0, limit - count), retryAfter };
}