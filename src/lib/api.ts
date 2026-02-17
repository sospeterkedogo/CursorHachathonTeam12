import { API_PATHS } from "@/constants";
import {
    Scan,
    LeaderboardEntry,
    Voucher,
    VisionResult
} from "@/types";

export async function fetchPersonalStats(userId: string) {
    const response = await fetch(`${API_PATHS.USER}/${userId}/stats`);
    if (!response.ok) {
        throw new Error("Failed to fetch personal stats");
    }
    return response.json();
}

export async function fetchVouchers(userId: string): Promise<Voucher[]> {
    const res = await fetch(`${API_PATHS.VOUCHERS}?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch vouchers");
    const data = await res.json();
    return data.vouchers || [];
}

export async function redeemVoucher(voucherId: string) {
    const res = await fetch(API_PATHS.REDEEM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherId })
    });
    if (!res.ok) throw new Error("Redemption failed");
    return res.json();
}

export async function fetchLeaderboard(userId?: string) {
    const url = userId ? `${API_PATHS.LEADERBOARD}?userId=${userId}` : API_PATHS.LEADERBOARD;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    return res.json();
}

export async function verifyAction(payload: {
    image?: string;
    userId: string;
    username?: string;
    avatar?: string;
    isPublic?: boolean;
    simulated?: boolean;
    source?: string;
}) {
    const res = await fetch(API_PATHS.VERIFY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Verification failed");
    return res.json();
}

export async function getVerificationStatus(scanId: string) {
    const res = await fetch(`${API_PATHS.VERIFY}/status/${scanId}`);
    if (!res.ok) throw new Error("Failed to fetch status");
    return res.json();
}

export async function deleteAction(scanId: string, userId: string) {
    const res = await fetch(`${API_PATHS.VERIFY}/${scanId}?userId=${userId}`, {
        method: "DELETE"
    });
    if (!res.ok) throw new Error("Deletion failed");
    return res.json();
}

export async function fetchUserActivity(userId: string, page = 0, limit = 10) {
    const res = await fetch(`${API_PATHS.USER}/${userId}/activity?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch user activity");
    return res.json();
}

export async function toggleVisibility(scanId: string, userId: string, isPublic: boolean) {
    const res = await fetch(`${API_PATHS.VERIFY}/${scanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isPublic })
    });
    if (!res.ok) throw new Error("Visibility update failed");
    return res.json();
}

export async function saveUserProfile(profile: {
    userId: string;
    username: string;
    avatar: string;
}) {
    const res = await fetch(API_PATHS.USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error("Failed to save profile");
    return res.json();
}

export async function submitFeedback(feedback: {
    userId: string;
    username?: string;
    rating?: number;
    comment?: string;
}) {
    const res = await fetch(API_PATHS.FEEDBACK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback)
    });
    if (!res.ok) throw new Error("Failed to submit feedback");
    return res.json();
}

export async function getFeedback() {
    const res = await fetch(API_PATHS.FEEDBACK);
    if (!res.ok) throw new Error("Failed to fetch feedback");
    return res.json();
}
