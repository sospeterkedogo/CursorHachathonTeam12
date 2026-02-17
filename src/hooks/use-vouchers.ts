import { useState, useCallback } from "react";
import * as api from "@/lib/api";
import { Voucher } from "@/types";
import { getUserId } from "@/lib/userId";

export function useVouchers() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loadingVouchers, setLoadingVouchers] = useState(false);

    const fetchVouchers = useCallback(async () => {
        setLoadingVouchers(true);
        try {
            const userId = getUserId();
            const data = await api.fetchVouchers(userId);
            setVouchers(data || []);
        } catch (err) {
            console.error("Failed to fetch vouchers:", err);
        } finally {
            setLoadingVouchers(false);
        }
    }, []);

    const handleActivateVoucher = useCallback(async (id: string) => {
        try {
            await api.redeemVoucher(id);
            setVouchers(prev => prev.map(v => v._id === id ? { ...v, used: true } : v));
        } catch (err) {
            console.error("Redemption API error:", err);
            throw err;
        }
    }, []);

    return {
        vouchers,
        loadingVouchers,
        fetchVouchers,
        handleActivateVoucher,
        setVouchers
    };
}
