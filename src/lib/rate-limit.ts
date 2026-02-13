export type RateLimitResult = {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
};

// In-memory store for rate limiting
// For production, use Redis or a similar persistent store
const storage = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(
    identifier: string,
    limit: number = 10,
    windowMs: number = 60000 // 1 minute window
): RateLimitResult {
    const now = Date.now();
    const key = `ratelimit:${identifier}`;
    const record = storage.get(key);

    if (!record || now > record.expiresAt) {
        const newRecord = {
            count: 1,
            expiresAt: now + windowMs,
        };
        storage.set(key, newRecord);
        return {
            success: true,
            limit,
            remaining: limit - 1,
            reset: newRecord.expiresAt,
        };
    }

    if (record.count >= limit) {
        return {
            success: false,
            limit,
            remaining: 0,
            reset: record.expiresAt,
        };
    }

    record.count += 1;
    return {
        success: true,
        limit,
        remaining: limit - record.count,
        reset: record.expiresAt,
    };
}

// Clean up expired records every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of storage.entries()) {
            if (now > record.expiresAt) {
                storage.delete(key);
            }
        }
    }, 300000);
}
