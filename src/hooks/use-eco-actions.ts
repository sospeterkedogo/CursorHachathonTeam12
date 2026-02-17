import { useState, useCallback } from "react";
import * as api from "@/lib/api";
import { Scan } from "@/types";
import { getUserId } from "@/lib/userId";
import { ensureString } from "@/lib/utils";

const confettiPromise = typeof window !== 'undefined' ? import("canvas-confetti").then((m) => m.default) : null;

export function useEcoActions(initialScans: Scan[], userProfile: { username: string; avatar: string } | null) {
    const [scans, setScans] = useState<Scan[]>(initialScans);
    const [userActivity, setUserActivity] = useState<Scan[]>([]);
    const [loadingActivity, setLoadingActivity] = useState(false);
    const [activityPage, setActivityPage] = useState(0);
    const [hasMoreActivity, setHasMoreActivity] = useState(true);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [earnedVoucher, setEarnedVoucher] = useState<any | null>(null);

    const fetchUserActivity = useCallback(async (page = 0, append = false) => {
        setLoadingActivity(true);
        try {
            const data = await api.fetchUserActivity(getUserId(), page, 10);
            if (data.activity) {
                if (append) {
                    setUserActivity(prev => [...prev, ...data.activity]);
                } else {
                    setUserActivity(data.activity);
                }
                setHasMoreActivity(data.hasMore);
                setActivityPage(page);
            }
        } catch (e) {
            console.error("Failed to fetch activity", e);
        } finally {
            setLoadingActivity(false);
        }
    }, []);

    const deleteScan = useCallback(async (scanId?: string, index?: number, onComplete?: (totalScore?: number) => void) => {
        if (!scanId) {
            if (typeof index === 'number') {
                setScans(prev => prev.filter((_, i) => i !== index));
            }
            return;
        }

        try {
            const res = await api.deleteAction(scanId, getUserId());
            if (res.success) {
                setScans(prev => prev.filter(s => s._id !== scanId));
                setUserActivity(prev => prev.filter(s => s._id !== scanId));
                if (onComplete) onComplete(res.totalScore);
            }
        } catch (err) {
            console.error("Failed to delete scan:", err);
        }
    }, []);

    const handleToggleVisibility = useCallback(async (scanId: string, isPublic: boolean) => {
        try {
            const res = await api.toggleVisibility(scanId, getUserId(), isPublic);
            if (res.success) {
                setUserActivity(prev => prev.map(s => s._id === scanId ? { ...s, isPublic } : s));
                const scanToUpdate = userActivity.find(s => s._id === scanId);

                if (isPublic) {
                    if (scanToUpdate) {
                        setScans(prev => {
                            if (prev.find(s => s._id === scanId)) {
                                return prev.map(s => s._id === scanId ? { ...s, isPublic } : s);
                            }
                            return [{ ...scanToUpdate, isPublic }, ...prev].slice(0, 100);
                        });
                    }
                } else {
                    setScans(prev => prev.filter(s => s._id !== scanId));
                }
            }
        } catch (err) {
            console.error("Failed to toggle visibility:", err);
        }
    }, [userActivity]);

    const submitImage = useCallback(async (imageBase64: string, source: "camera" | "gallery" = "camera", onComplete?: (data: any) => void) => {
        let progressInterval: NodeJS.Timeout | null = null;
        const tempScanId = Math.random().toString(36).substring(7);

        setLoading(true);
        setProgress(0);
        setFeedback(null);
        setVerified(null);
        setScore(null);
        setEarnedVoucher(null);

        const pendingScan: Scan = {
            image: imageBase64,
            actionType: "Verifying...",
            score: 0,
            timestamp: new Date().toISOString(),
            username: userProfile?.username,
            avatar: userProfile?.avatar,
            status: "pending",
            _id: tempScanId
        };

        setScans(prev => [pendingScan, ...prev]);

        progressInterval = setInterval(() => {
            setProgress(prev => (prev >= 90 ? 90 : prev + 10));
        }, 500);

        const handleVerificationComplete = async (data: any) => {
            if (progressInterval) clearInterval(progressInterval);
            setProgress(100);
            setTimeout(() => {
                setProgress(0);
                setLoading(false);
            }, 1000);

            setVerified(data.verified);
            setScore(typeof data.score === "number" ? data.score : null);
            setFeedback(ensureString(data.message));
            setAudioUrl(data.audioUrl || null);

            setScans((prev) => {
                const filtered = prev.filter(s => !(s.actionType === "Verifying..." && s.image === imageBase64));

                if (data.verified || (typeof data.score === "number" && data.score > 0)) {
                    const addedScore = typeof data.score === "number" ? data.score : 0;
                    const newScan: Scan = {
                        _id: data._id,
                        userId: data.userId,
                        image: imageBase64,
                        actionType: data.actionType || "eco-action",
                        score: addedScore,
                        timestamp: data.timestamp || new Date().toISOString(),
                        username: userProfile?.username,
                        avatar: userProfile?.avatar,
                        status: 'completed'
                    };

                    setUserActivity(prev => [newScan, ...prev]);
                    return [newScan, ...filtered].slice(0, 100);
                }

                if (data.status === 'failed' || data.verified === false) {
                    const failedScan: Scan = {
                        _id: data._id,
                        userId: data.userId,
                        image: imageBase64,
                        actionType: data.actionType || "Failed Verification",
                        score: 0,
                        timestamp: data.timestamp || new Date().toISOString(),
                        username: userProfile?.username,
                        avatar: userProfile?.avatar,
                        status: 'failed'
                    };
                    setUserActivity(prev => [failedScan, ...prev]);
                }

                return filtered;
            });

            if (data.verified || (typeof data.score === "number" && data.score > 0)) {
                if (data.voucher) {
                    setEarnedVoucher(data.voucher);
                }

                if (confettiPromise) {
                    confettiPromise.then(confetti => {
                        confetti({
                            particleCount: 120,
                            spread: 70,
                            origin: { y: 0.7 },
                            colors: ["#22c55e", "#a3e635", "#bbf7d0"]
                        });
                    }).catch(() => { });
                }
            }

            if (onComplete) onComplete(data);
        };

        try {
            const response = await api.verifyAction({
                image: imageBase64,
                userId: getUserId(),
                username: userProfile?.username,
                avatar: userProfile?.avatar,
                isPublic: source === "gallery" ? false : true, // Simplified
                source: source
            });

            if (response.status === "pending" && response.scanId) {
                let attempts = 0;
                const maxAttempts = 30;
                const scanId = response.scanId;

                while (attempts < maxAttempts) {
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const statusData = await api.getVerificationStatus(scanId);

                    if (statusData.status === "completed") {
                        handleVerificationComplete(statusData);
                        return;
                    } else if (statusData.status === "failed") {
                        throw new Error(statusData.error || "Verification failed");
                    }
                }
                throw new Error("Verification timed out");
            } else {
                handleVerificationComplete(response);
            }
        } catch (err: any) {
            console.error(err);
            setScans(prev => prev.filter(s => !(s.actionType === "Verifying..." && s.image === imageBase64)));
            setFeedback("Something went wrong. Please try again.");
            setVerified(false);
            if (progressInterval) clearInterval(progressInterval);
            setLoading(false);
        }
    }, [userProfile]);

    return {
        scans,
        setScans,
        userActivity,
        loadingActivity,
        activityPage,
        hasMoreActivity,
        fetchUserActivity,
        deleteScan,
        handleToggleVisibility,
        submitImage,
        loading,
        progress,
        feedback,
        verified,
        score,
        audioUrl,
        earnedVoucher
    };
}
