
export function formatCO2(mg: number): string {
    if (mg === 0) return "0 mg";

    // 1 tonne = 1,000,000,000 mg
    // 1 kg = 1,000,000 mg
    // 1 g = 1,000 mg

    if (mg >= 1000000000) {
        return `${(mg / 1000000000).toFixed(2)} Tonnes`;
    }
    if (mg >= 1000000) {
        return `${(mg / 1000000).toFixed(2)} kg`;
    }
    if (mg >= 1000) {
        return `${(mg / 1000).toFixed(1)} g`;
    }
    return `${Math.round(mg)} mg`;
}

export function formatPoints(points: number): string {
    return points.toLocaleString();
}

/**
 * Formats large numbers with suffixes (k, M, B, T)
 * @param num The number to format
 * @returns Formatted string (e.g. "1.5k", "2.3M")
 */
export function formatCompactNumber(num: number): string {
    if (num >= 1000000000000) {
        return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
    }
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}
