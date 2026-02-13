export const ensureString = (msg: any): string => {
    if (typeof msg === "string") return msg;
    if (!msg) return "";
    if (typeof msg === "object") {
        return msg.message || msg.error || msg.details || JSON.stringify(msg);
    }
    return String(msg);
};

export async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
    const { timeout = 25000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        return response;
    } finally {
        clearTimeout(id);
    }
}

// Client-side local storage keys
export const STORAGE_KEYS = {
    USER_ID: "eco_verify_user_id",
    USERNAME: "eco_username",
    AVATAR: "eco_avatar",
    HIDE_ONBOARDING: "hide_onboarding"
};
