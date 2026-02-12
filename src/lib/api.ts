
export async function fetchPersonalStats(userId: string) {
    const response = await fetch(`/api/user/${userId}/stats`);
    if (!response.ok) {
        throw new Error("Failed to fetch personal stats");
    }
    return response.json();
}
