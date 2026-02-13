import { STORAGE_KEYS } from "./utils";

export function getUserId(): string {
    if (typeof window === "undefined") {
        return "";
    }

    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

    if (!userId) {
        const newId = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEYS.USER_ID, newId);
        return newId;
    }

    return userId;
}
