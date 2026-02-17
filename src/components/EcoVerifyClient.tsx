'use client';

import { useRef, useState, useEffect } from "react";
import {
  Camera,
  Leaf,
  Trophy,
  Ticket,
  User,
  Settings,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Loader2,
  MessageSquare,
  Image as ImageIcon,
  X as CloseIcon,
  Maximize2,
  ExternalLink,
  Trash2,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getUserId } from "@/lib/userId";
import { ThemeToggle } from "./ThemeToggle";
import Onboarding from "./Onboarding";
import Leaderboard from "./Leaderboard";
import VoucherList from "./VoucherList";
import FeedbackModal from "./FeedbackModal";

import { Scan, LeaderboardEntry, Voucher, EcoVerifyClientProps } from "@/types";
import { AVATARS, UI_CHUNKS, API_PATHS } from "@/constants";
import { ensureString, STORAGE_KEYS } from "@/lib/utils";
import * as api from "@/lib/api";

const confettiPromise = import("canvas-confetti").then((m) => m.default);

export default function EcoVerifyClient({ initialTotalScore, initialScans, initialLeaderboard, itemOne, itemTwo }: EcoVerifyClientProps) {
  const [activeTab, setActiveTab] = useState<"verify" | "leaderboard" | "vouchers" | "profile">("verify");
  const [globalScore, setGlobalScore] = useState(initialTotalScore);
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  const [globalVerifiedUsers, setGlobalVerifiedUsers] = useState(itemOne);
  const [globalVouchersCount, setGlobalVouchersCount] = useState(itemTwo);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [earnedVoucher, setEarnedVoucher] = useState<any | null>(null);

  const [userActivity, setUserActivity] = useState<Scan[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityPage, setActivityPage] = useState(0);
  const [hasMoreActivity, setHasMoreActivity] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const STORED_IMAGES = [
    {
      id: "recycling",
      url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format",
      label: "Recycling Station"
    },
    {
      id: "reusable",
      url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=600&auto=format",
      label: "Reusable Mug"
    },
    {
      id: "solar",
      url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600&auto=format",
      label: "Solar Panels"
    },
    {
      id: "bicycle",
      url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=600&auto=format",
      label: "Zero-Emission Transit"
    },
    {
      id: "plants",
      url: "https://images.unsplash.com/photo-1599309015934-8b64b38d3856?q=80&w=600&auto=format",
      label: "Nature Conservation"
    }
  ];

  const [userProfile, setUserProfile] = useState<{ username: string; avatar: string } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [inputUsername, setInputUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem(STORAGE_KEYS.USERNAME);
    const savedAvatar = localStorage.getItem(STORAGE_KEYS.AVATAR);
    if (savedName && savedAvatar) {
      setUserProfile({ username: savedName, avatar: savedAvatar });
      setInputUsername(savedName);
      setSelectedAvatar(savedAvatar);
    }

    const hideOnboarding = localStorage.getItem(STORAGE_KEYS.HIDE_ONBOARDING);
    if (!hideOnboarding) {
      setShowOnboarding(true);
    }
    setIsMounted(true);
  }, []);

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUsername = async () => {
      if (!inputUsername.trim() || inputUsername === userProfile?.username) {
        setUsernameAvailable(null);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const res = await fetch(`${API_PATHS.USER}?username=${encodeURIComponent(inputUsername)}`);
        const rawData = await res.json();
        setUsernameAvailable(rawData.available);
      } catch (error) {
        console.error("Failed to check username:", error);
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [inputUsername, userProfile?.username]);

  const [userRank, setUserRank] = useState<number | null>(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const fetchVouchers = async () => {
    setLoadingVouchers(true);
    try {
      const userId = getUserId();
      const res = await fetch(`/api/vouchers?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setVouchers(data.vouchers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVouchers(false);
    }
  };

  const handleActivateVoucher = async (id: string) => {
    try {
      await api.redeemVoucher(id);
      setVouchers(prev => prev.map(v => v._id === id ? { ...v, used: true } : v));
    } catch (err) {
      console.error("Redemption API error:", err);
    }
  };

  const fetchLeaderboardAndStats = async () => {
    setLoadingLeaderboard(true);
    try {
      const data = await api.fetchLeaderboard(getUserId());
      setLeaderboard(data.leaderboard);
      if (typeof data.totalVerifiedUsers === 'number') setGlobalVerifiedUsers(data.totalVerifiedUsers);
      if (typeof data.totalVouchers === 'number') setGlobalVouchersCount(data.totalVouchers);
      if (typeof data.userRank === 'number') setUserRank(data.userRank);
    } catch (e) {
      console.error("Failed to fetch leaderboard/stats", e);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const fetchUserActivity = async (page = 0, append = false) => {
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
  };

  const saveProfile = async () => {
    if (!inputUsername.trim()) return;

    const userId = getUserId();
    const newProfile = { username: inputUsername, avatar: selectedAvatar };

    try {
      await api.saveUserProfile({ userId, ...newProfile });
      setUserProfile(newProfile);
      localStorage.setItem(STORAGE_KEYS.USERNAME, inputUsername);
      localStorage.setItem(STORAGE_KEYS.AVATAR, selectedAvatar);
      setShowProfileModal(false);

      const data = await api.fetchLeaderboard();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const handleClearCache = () => {
    if (confirm("This will clear your local sessions and reset your profile. Your verified actions will remain on the server. Proceed?")) {
      localStorage.removeItem(STORAGE_KEYS.USERNAME);
      localStorage.removeItem(STORAGE_KEYS.AVATAR);
      localStorage.removeItem(STORAGE_KEYS.HIDE_ONBOARDING);
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("CRITICAL: This will permanently delete your account and all your verified actions. This cannot be undone. Are you absolutely sure?")) {
      try {
        await api.deleteAccount(getUserId());
        localStorage.clear();
        window.location.reload();
      } catch (err) {
        console.error("Failed to delete account:", err);
        alert("Failed to delete account. Please try again later.");
      }
    }
  };

  const generateRandomName = () => {
    const randomName = `${UI_CHUNKS.ADJECTIVES[Math.floor(Math.random() * UI_CHUNKS.ADJECTIVES.length)]}${UI_CHUNKS.NOUNS[Math.floor(Math.random() * UI_CHUNKS.NOUNS.length)]}${Math.floor(Math.random() * 99)}`;
    setInputUsername(randomName);
    setSelectedAvatar(AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];
      await submitImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const deleteScan = async (scanId?: string, index?: number) => {
    if (!scanId) {
      // For local-only (e.g. pending/unsaved) deletions
      if (typeof index === 'number') {
        setScans(prev => prev.filter((_, i) => i !== index));
      }
      return;
    }

    try {
      const res = await api.deleteAction(scanId, getUserId());
      if (res.success) {
        // Remove from both local lists
        setScans(prev => prev.filter(s => s._id !== scanId));
        setUserActivity(prev => prev.filter(s => s._id !== scanId));
        if (typeof res.totalScore === 'number') {
          setGlobalScore(res.totalScore);
        }
        await fetchLeaderboardAndStats();
      }
    } catch (err) {
      console.error("Failed to delete scan:", err);
    }
  };

  const handleToggleVisibility = async (scanId: string, isPublic: boolean) => {
    try {
      const res = await api.toggleVisibility(scanId, getUserId(), isPublic);
      if (res.success) {
        // Update local state in both lists
        setUserActivity(prev => prev.map(s => s._id === scanId ? { ...s, isPublic } : s));

        if (isPublic) {
          // If made public, we might need to add it to the global scans if it's not there
          const scanToUpdate = userActivity.find(s => s._id === scanId);
          if (scanToUpdate) {
            setScans(prev => {
              if (prev.find(s => s._id === scanId)) {
                return prev.map(s => s._id === scanId ? { ...s, isPublic } : s);
              }
              return [{ ...scanToUpdate, isPublic }, ...prev].slice(0, 100);
            });
          }
        } else {
          // If made private, remove from global scans
          setScans(prev => prev.filter(s => s._id !== scanId));
        }
      }
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  };

  const submitImage = async (imageBase64: string, source: "camera" | "gallery" = "camera") => {
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

    try {
      const response = await api.verifyAction({
        image: imageBase64,
        userId: getUserId(),
        username: userProfile?.username,
        avatar: userProfile?.avatar,
        isPublic: source === "gallery" ? false : isPublic,
        source: source
      });

      if (response.status === "pending" && response.scanId) {
        // Polling loop
        let attempts = 0;
        const maxAttempts = 30; // 60 seconds max
        const scanId = response.scanId;

        while (attempts < maxAttempts) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000));

          const statusData = await api.getVerificationStatus(scanId);

          if (statusData.status === "completed") {
            // Remove the pending scan and add the completed one in one flow
            handleVerificationComplete(statusData, imageBase64, progressInterval);
            return;
          } else if (statusData.status === "failed") {
            throw new Error(statusData.error || "Verification failed");
          }
          // Continue polling
        }
        throw new Error("Verification timed out");
      } else {
        // Fallback for immediate response (if any) or unexpected format
        handleVerificationComplete(response, imageBase64, progressInterval);
      }
    } catch (err: any) {
      console.error(err);
      // Ensure placeholder is removed on error
      setScans(prev => prev.filter(s => !(s.actionType === "Verifying..." && s.image === imageBase64)));
      setFeedback("Something went wrong. Please try again.");
      setVerified(false);
      if (progressInterval) clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const handleVerificationComplete = async (data: any, imageBase64: string, progressInterval: NodeJS.Timeout | null) => {
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

    // Filter out the pending placeholder scan first
    let currentScans: Scan[] = [];
    setScans((prev) => {
      const filtered = prev.filter(s => !(s.actionType === "Verifying..." && s.image === imageBase64));

      if (data.verified || (typeof data.score === "number" && data.score > 0)) {
        const addedScore = typeof data.score === "number" ? data.score : 0;
        const newScan: Scan = {
          _id: data._id, // Use persistent ID from status API
          userId: data.userId,
          image: imageBase64,
          actionType: data.actionType || "eco-action",
          score: addedScore,
          timestamp: data.timestamp || new Date().toISOString(),
          username: userProfile?.username,
          avatar: userProfile?.avatar,
          status: 'completed'
        };
        currentScans = [newScan, ...filtered].slice(0, 100);

        // Also update activity history if it was already fetched
        setUserActivity(prev => [newScan, ...prev]);

        return currentScans;
      }

      // If NOT verified, we might still want it in our personal activity history if the API stored it
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
      const addedScore = typeof data.score === "number" ? data.score : 0;
      setGlobalScore((prev) => prev + addedScore);

      if (data.voucher) {
        setEarnedVoucher(data.voucher);
        api.fetchVouchers(getUserId()).then(v => setVouchers(v));
      }

      setCurrentPage(0);
      await fetchLeaderboardAndStats();

      try {
        const confetti = await confettiPromise;
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#22c55e", "#a3e635", "#bbf7d0"]
        });
      } catch (err) {
        console.warn("Confetti failed:", err);
      }

      if (!userProfile) {
        setTimeout(() => setShowProfileModal(true), 1500);
      }
    }

    api.fetchLeaderboard().then(d => {
      if (d.leaderboard) setLeaderboard(d.leaderboard);
    });

    if (data.audioUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  };

  const Header = () => (
    <header className="flex items-center justify-between mb-6 pt-4 px-2">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight leading-none text-neutral-900 dark:text-white">
            EcoVerify
          </h1>
          <p className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase mt-0.5">Impact Tracker</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:text-emerald-500 transition-all shadow-sm"
          aria-label="Give Feedback"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <ThemeToggle />
        <div
          onClick={() => setShowProfileModal(true)}
          className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xl cursor-pointer hover:border-emerald-500 transition-all relative overflow-hidden"
        >
          {userProfile?.avatar || <User className="w-5 h-5 text-neutral-400" />}
        </div>
      </div>
    </header>
  );

  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-neutral-200 dark:border-white/10 animate-slide-up">
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between p-1">
        <button
          onClick={() => setActiveTab("verify")}
          className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${activeTab === "verify" ? "text-emerald-500" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          <Camera className={`w-5 h-5 flex-shrink-0 ${activeTab === "verify" ? "fill-emerald-500/10" : ""}`} />
          <span className={`text-[10px] font-bold uppercase tracking-tight ${activeTab === "verify" ? "opacity-100" : "opacity-60"}`}>Home</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("leaderboard");
            fetchLeaderboardAndStats();
          }}
          className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${activeTab === "leaderboard" ? "text-amber-500" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          <Trophy className={`w-5 h-5 flex-shrink-0 ${activeTab === "leaderboard" ? "fill-amber-500/10" : ""}`} />
          <span className={`text-[10px] font-bold uppercase tracking-tight ${activeTab === "leaderboard" ? "opacity-100" : "opacity-60"}`}>Ranking</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("vouchers");
            fetchVouchers();
          }}
          className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${activeTab === "vouchers" ? "text-purple-500" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          <Ticket className={`w-5 h-5 flex-shrink-0 ${activeTab === "vouchers" ? "fill-purple-500/10" : ""}`} />
          <span className={`text-[10px] font-bold uppercase tracking-tight ${activeTab === "vouchers" ? "opacity-100" : "opacity-60"}`}>Rewards</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("profile");
            fetchUserActivity(0, false);
          }}
          className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-1 ${activeTab === "profile" ? "text-indigo-500" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
        >
          <User className={`w-5 h-5 flex-shrink-0 ${activeTab === "profile" ? "fill-indigo-500/10" : ""}`} />
          <span className={`text-[10px] font-bold uppercase tracking-tight ${activeTab === "profile" ? "opacity-100" : "opacity-60"}`}>Profile</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="w-full mx-auto px-4 pb-20">
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} totalVerifiedUsers={globalVerifiedUsers} totalVouchers={globalVouchersCount} />}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        username={userProfile?.username}
      />
      <Header />
      <BottomNav />

      <div className="flex items-center justify-between bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 mb-6 animate-fade-in shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Global Impact</span>
          <span className="text-2xl font-black text-emerald-500 tabular-nums">
            {globalScore.toLocaleString()}
          </span>
        </div>
        {userRank && (
          <div className="text-right">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Global Rank</span>
            <div className="flex items-center justify-end gap-1">
              <span className="text-xl font-black text-neutral-800 dark:text-neutral-200">#{userRank}</span>
            </div>
          </div>
        )}
      </div>

      {activeTab === "leaderboard" ? (
        <Leaderboard
          entries={leaderboard}
          currentUserId={getUserId()}
          loading={loadingLeaderboard}
        />
      ) : activeTab === "vouchers" ? (
        <VoucherList
          vouchers={vouchers}
          loading={loadingVouchers}
          onActivate={handleActivateVoucher}
        />
      ) : activeTab === "profile" ? (
        isMounted ? (
          <ProfileView
            activity={userActivity}
            loading={loadingActivity}
            onDelete={deleteScan}
            onToggleVisibility={handleToggleVisibility}
            currentUserId={getUserId()}
            userProfile={userProfile}
            hasMore={hasMoreActivity}
            onLoadMore={() => fetchUserActivity(activityPage + 1, true)}
            onUpdateProfile={() => setShowProfileModal(true)}
            onClearCache={handleClearCache}
            onDeleteAccount={handleDeleteAccount}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
            <span className="text-xs font-bold text-neutral-500 uppercase">Loading Profile...</span>
          </div>
        )
      ) : (
        <>
          <div className="apple-card relative overflow-hidden mb-8 group">
            <div className="p-6 flex flex-col items-center justify-center min-h-[320px] relative z-10 text-center">
              <div className="mb-6 relative">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 flex items-center justify-center border border-emerald-500/20 mb-4 mx-auto">
                  <Leaf className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Verify Action</h2>
                <p className="text-sm text-neutral-400 max-w-[240px] mx-auto leading-relaxed">
                  Take a photo of your eco-friendly habit to verify and earn points.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[320px]">
                <button
                  onClick={triggerFileInput}
                  disabled={loading}
                  className="primary-btn rounded-full py-4 flex items-center justify-center gap-2 text-lg font-bold shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  <span>{loading ? "Wait..." : "Camera"}</span>
                </button>

                <button
                  onClick={() => setShowImageGallery(true)}
                  disabled={loading}
                  className="bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-full py-4 flex items-center justify-center gap-2 text-lg font-bold shadow-lg border border-neutral-200 dark:border-white/10 transition-all"
                >
                  <ImageIcon className="w-5 h-5 text-emerald-500" />
                  <span>Gallery</span>
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors ${isPublic ? 'bg-emerald-500' : 'bg-neutral-600'}`}>
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium group-hover:text-neutral-300">Share with global community</span>
                </label>
              </div>
            </div>

            {loading && (
              <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 transition-all duration-500">
                <div className="relative w-24 h-24 mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} transform="rotate(-90 50 50)" className="transition-all duration-300 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white tabular-nums">{Math.round(progress)}%</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Analyzing...</h3>
                <p className="text-sm text-neutral-400">Verifying your eco-action</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {(feedback || verified !== null) && (
            <div className={`apple-card p-5 mb-8 flex flex-col gap-3 transition-all duration-300 ${verified ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${verified ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                    {verified ? <Leaf className="w-4 h-4" /> : <div className="w-4 h-4 rounded-sm border-2 border-current" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${verified ? 'text-emerald-500' : 'text-red-500'}`}>
                      {verified ? "Verified!" : "Could not verify"}
                    </p>
                    {feedback && <p className="text-sm text-neutral-500 dark:text-neutral-300 leading-snug mt-1">{feedback}</p>}
                  </div>
                </div>
                {verified && typeof score === "number" && (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex flex-col items-center bg-black/5 dark:bg-white/5 rounded-lg px-3 py-1.5 border border-black/5 dark:border-white/5">
                      <span className="text-[10px] uppercase text-neutral-500 font-bold">Score</span>
                      <span className="text-xl font-bold text-emerald-500 tabular-nums">+{score}</span>
                    </div>
                  </div>
                )}
              </div>

              {earnedVoucher && (
                <div className="mt-3 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 relative overflow-hidden animate-slide-up">
                  <p className="text-xs uppercase tracking-widest text-purple-500 font-bold mb-1">Reward Unlocked!</p>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">{earnedVoucher.title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{earnedVoucher.description}</p>
                  <div className="flex items-center justify-between bg-black/5 dark:bg-black/40 rounded px-3 py-2 border border-purple-500/20">
                    <code className="font-mono text-purple-600 dark:text-purple-300 font-bold">{earnedVoucher.code}</code>
                    <button onClick={() => setActiveTab("vouchers")} className="text-[10px] bg-purple-500 text-white px-2 py-1 rounded transition-colors">
                      View Wallet
                    </button>
                  </div>
                </div>
              )}

              {audioUrl && (
                <div className="mt-2 bg-black/5 dark:bg-black/20 rounded-lg p-2">
                  <audio ref={audioRef} src={audioUrl} controls className="w-full h-8 opacity-80" />
                </div>
              )}
            </div>
          )}

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Recent Activity</h3>
            </div>

            {scans.length === 0 ? (
              <div className="glass-panel p-8 text-center text-neutral-500 text-sm">
                No scans yet. Be the first!
              </div>
            ) : (
              <div className="space-y-4">
                {scans.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((scan, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-4 flex items-center gap-4 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all cursor-pointer group/card border border-neutral-200 dark:border-white/10"
                    onClick={() => setLightboxImage(scan.image)}
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center relative z-10 shadow-inner group-hover/card:border-emerald-500/50 transition-colors">
                        <img
                          src={scan.image && scan.image.length > 200
                            ? (scan.image.startsWith('data:') ? scan.image : `data:image/jpeg;base64,${scan.image}`)
                            : (scan.image.startsWith('http') ? scan.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(scan.actionType || 'Eco')}&background=059669&color=fff&size=128`)}
                          alt="eco action"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 flex items-center justify-center transition-opacity">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 dark:bg-emerald-900 border border-white dark:border-black flex items-center justify-center z-20 overflow-hidden text-xs shadow-lg">
                        {scan.avatar || "👤"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 ml-1">
                      <span className="font-bold text-sm text-neutral-900 dark:text-neutral-200 truncate block">{scan.username || "Anonymous"}</span>
                      {scan.status === 'pending' ? (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
                          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight">Verifying...</span>
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 capitalize font-medium truncate mb-1">{scan.actionType.replace(/-/g, ' ')}</p>
                      )}
                      <span className="text-[10px] text-neutral-500">
                        {isMounted ? new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}
                      </span>
                    </div>
                    {scan.userId && (
                      <div className="flex items-center gap-1">
                        {scan.score > 0 && (
                          <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-black tabular-nums border border-emerald-500/20">
                            +{scan.score}
                          </div>
                        )}
                        {isMounted && (scan.userId === getUserId()) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteScan(scan._id, idx);
                            }}
                            className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <span className="text-[10px] font-bold">✕</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Pagination Controls */}
                {scans.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-between pt-4 px-1">
                    <button
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 disabled:opacity-30 transition-all border border-neutral-200 dark:border-neutral-700 hover:text-emerald-500"
                    >
                      Previous
                    </button>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      Page {currentPage + 1} of {Math.ceil(scans.length / ITEMS_PER_PAGE)}
                    </span>
                    <button
                      disabled={currentPage >= Math.ceil(scans.length / ITEMS_PER_PAGE) - 1}
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(scans.length / ITEMS_PER_PAGE) - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 disabled:opacity-30 transition-all border border-neutral-200 dark:border-neutral-700 hover:text-emerald-500"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Claim Your Profile</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Save your username to appear on the leaderboard.</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-emerald-500/50 flex items-center justify-center text-4xl shadow-lg">
                {selectedAvatar}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors ${selectedAvatar === avatar ? "bg-neutral-200 dark:bg-white/20 ring-2 ring-emerald-500" : ""}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">Username</label>
                <div className="flex gap-2">
                  <input
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    placeholder="Enter username"
                    className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    onClick={generateRandomName}
                    className="px-3 py-2 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500"
                  >
                    🎲
                  </button>
                </div>
                <div className="h-4 mt-1 pl-1">
                  {isCheckingUsername ? (
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                    </span>
                  ) : usernameAvailable === true ? (
                    <span className="text-xs text-emerald-500 flex items-center gap-1">
                      ✓ Username available
                    </span>
                  ) : usernameAvailable === false ? (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      ✕ Username taken
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                onClick={saveProfile}
                disabled={!inputUsername.trim() || usernameAvailable === false || isCheckingUsername}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                Save Profile
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 py-8 text-center border-t border-neutral-200 dark:border-white/5">
        <div className="flex items-center justify-center gap-2 mb-2 opacity-60">
          <Leaf className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-semibold text-neutral-500">EcoVerify</span>
        </div>
        <p className="text-xs text-neutral-500">
          © 2026 EcoVerify. Built for the Planet. <br />
          Made by Pete and Pavan
        </p>
      </footer>

      {showImageGallery && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Eco Gallery</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Select a pre-verified action to test</p>
              </div>
              <button
                onClick={() => setShowImageGallery(false)}
                className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 hover:text-emerald-500 transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-2 gap-4">
              {STORED_IMAGES.map((img) => (
                <button
                  key={img.id}
                  onClick={async () => {
                    setShowImageGallery(false);
                    try {
                      setLoading(true);
                      const response = await fetch(img.url);
                      const blob = await response.blob();
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = (reader.result as string).split(",")[1];
                        submitImage(base64);
                      };
                      reader.readAsDataURL(blob);
                    } catch (err) {
                      console.error("Failed to load gallery image", err);
                      setLoading(false);
                    }
                  }}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/5 hover:border-emerald-500 transition-all"
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </button>
              ))}
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-white/5 text-center">
              <p className="text-[10px] text-neutral-500 font-medium">Images for demonstration purposes</p>
            </div>
          </div>
        </div>
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white z-[110] hover:bg-white/20 transition-all"
            onClick={() => setLightboxImage(null)}
          >
            <CloseIcon className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img
              src={lightboxImage.length > 200
                ? (lightboxImage.startsWith('data:') ? lightboxImage : `data:image/jpeg;base64,${lightboxImage}`)
                : lightboxImage}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl animate-fade-in"
              alt="Enlarged eco action"
            />
          </div>

          <div className="absolute bottom-10 left-0 right-0 text-center text-white/60 text-sm font-medium">
            Tap to close
          </div>
        </div>
      )}
    </div>
  );
}

// --- Profile View Component ---
function ProfileView({ activity, loading, onDelete, onToggleVisibility, currentUserId, userProfile, hasMore, onLoadMore, onUpdateProfile, onClearCache, onDeleteAccount }: {
  activity: Scan[];
  loading: boolean;
  onDelete: (id?: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
  currentUserId: string;
  userProfile: { username: string; avatar: string } | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onUpdateProfile: () => void;
  onClearCache: () => void;
  onDeleteAccount: () => void;
}) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="glass-panel p-6 border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center relative overflow-hidden">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-all ${showSettings ? 'bg-emerald-500 text-white' : 'bg-white/50 dark:bg-black/50 text-neutral-500 hover:text-emerald-500'}`}
        >
          <Settings className={`w-5 h-5 ${showSettings ? 'animate-spin-slow' : ''}`} />
        </button>

        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-emerald-500 flex items-center justify-center text-3xl mb-3 shadow-lg">
          {userProfile?.avatar || "👤"}
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
          {userProfile?.username || "Guest Impact"}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Impact Dashboard</span>
          <div className="w-1 h-1 rounded-full bg-neutral-300" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Personal Action Log</span>
        </div>
      </div>

      {showSettings && (
        <div className="glass-panel p-6 border-neutral-200 dark:border-white/10 animate-slide-up space-y-6">
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button
                onClick={onUpdateProfile}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all border border-neutral-200 dark:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold">Edit Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={onClearCache}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all border border-neutral-200 dark:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-semibold">Clear Local Cache</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={onDeleteAccount}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/20 group"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-semibold text-red-500">Delete Account</span>
                </div>
                <AlertTriangle className="w-4 h-4 text-red-500/50 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Your Activity</h3>
        </div>

        {activity.length === 0 && !loading ? (
          <div className="glass-panel p-12 text-center border-dashed border-neutral-200 dark:border-white/10">
            <p className="text-sm text-neutral-500">Your ecological footprints will appear here.</p>
            <p className="text-[10px] text-neutral-400 mt-2 uppercase tracking-tighter">Start verifying to make an impact!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activity.map((scan, idx) => (
              <div key={scan._id || idx} className="glass-panel p-4 flex flex-col gap-4 border border-neutral-200 dark:border-white/5 group/activity">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 dark:border-white/10 flex-shrink-0 bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={scan.image && scan.image.length > 200
                        ? (scan.image.startsWith('data:') ? scan.image : `data:image/jpeg;base64,${scan.image}`)
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(scan.actionType)}&background=059669&color=fff`}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate pr-2">
                        {scan.actionType.replace(/-/g, ' ')}
                      </h4>
                      {scan.score > 0 && (
                        <span className="text-sm font-black text-emerald-500 tabular-nums shrink-0">+{scan.score}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${scan.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {scan.status || 'Verified'}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-white/5 mt-1">
                  <div className="flex items-center gap-1.5 grayscale group-hover/activity:grayscale-0 transition-all opacity-60 group-hover/activity:opacity-100">
                    <div className={`w-1.5 h-1.5 rounded-full ${scan.isPublic ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-neutral-400'}`} />
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">
                      {scan.isPublic ? 'Public Feed' : 'Private Draft'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {scan.status !== 'pending' && (
                      <button
                        onClick={() => scan._id && onToggleVisibility(scan._id, !scan.isPublic)}
                        className={`px-3 py-1 rounded-lg text-[9px] font-bold transition-all uppercase tracking-widest border ${scan.isPublic ? 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-red-500 hover:border-red-200' : 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20'}`}
                      >
                        {scan.isPublic ? 'Remove from Feed' : 'Add to Feed'}
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(scan._id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                      title="Delete action"
                    >
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load older actions"}
          </button>
        )}

        <div className="pt-12 pb-8 flex flex-col items-center gap-4 border-t border-neutral-100 dark:border-white/5">
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-[10px] font-bold text-neutral-400 hover:text-emerald-500 transition-colors uppercase tracking-widest">Privacy Policy</a>
            <a href="/terms" className="text-[10px] font-bold text-neutral-400 hover:text-emerald-500 transition-colors uppercase tracking-widest">Terms of Service</a>
          </div>
          <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-tighter opacity-50">EcoVerify Hackathon v1.0 • 2026</p>
        </div>
      </section>
    </div>
  );
}
