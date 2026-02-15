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
  MessageSquare
} from "lucide-react";
import dynamic from "next/dynamic";
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
  const [activeTab, setActiveTab] = useState<"verify" | "leaderboard" | "vouchers">("verify");
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
  const [earnedVoucher, setEarnedVoucher] = useState<Voucher | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false); // Default to false, check in useEffect
  const [isPublic, setIsPublic] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // ... existing code ...



  const [userProfile, setUserProfile] = useState<{ username: string; avatar: string } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [inputUsername, setInputUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Synchronize local profile and onboarding state from storage on mount.
    const savedName = localStorage.getItem(STORAGE_KEYS.USERNAME);
    const savedAvatar = localStorage.getItem(STORAGE_KEYS.AVATAR);
    if (savedName && savedAvatar) {
      setUserProfile({ username: savedName, avatar: savedAvatar });
      setInputUsername(savedName);
      setSelectedAvatar(savedAvatar);
    }

    // Check onboarding
    const hideOnboarding = localStorage.getItem(STORAGE_KEYS.HIDE_ONBOARDING);
    if (!hideOnboarding) {
      setShowOnboarding(true);
    }
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
        const data = await api.fetchLeaderboard(inputUsername); // Reuse fetchLeaderboard or add checkUsername to api lib
        // Assuming checkUsername exists or we use a more generic check
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

    const timeoutId = setTimeout(checkUsername, 500); // 500ms debounce to limit API calls during typing
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

  const saveProfile = async () => {
    if (!inputUsername.trim()) return;

    const userId = getUserId();
    const newProfile = { username: inputUsername, avatar: selectedAvatar };

    setUserProfile(newProfile);
    localStorage.setItem(STORAGE_KEYS.USERNAME, inputUsername);
    localStorage.setItem(STORAGE_KEYS.AVATAR, selectedAvatar);
    setShowProfileModal(false);

    // Synchronize local profile changes to the backend and update the global leaderboard.
    try {
      await api.saveUserProfile({ userId, ...newProfile });
      const data = await api.fetchLeaderboard();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error("Failed to save profile:", err);
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

  const deleteScan = (index: number) => {
    setScans(prev => prev.filter((_, i) => i !== index));
  };

  const submitImage = async (imageBase64: string) => {
    let progressInterval: NodeJS.Timeout;

    try {
      setLoading(true);
      setProgress(0);
      setFeedback(null);
      setVerified(null);
      setScore(null);
      setAudioUrl(null);
      setEarnedVoucher(null);

      // Mimic backend processing progress for user feedback.
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const next = prev + Math.floor(Math.random() * 10) + 5;
          return next > 90 ? 90 : next;
        });
      }, 500);

      const data = await api.verifyAction({
        image: imageBase64,
        userId: getUserId(),
        username: userProfile?.username,
        avatar: userProfile?.avatar,
        isPublic
      });

      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);

      setVerified(data.verified);
      setScore(typeof data.score === "number" ? data.score : null);
      setFeedback(ensureString(data.message));
      setAudioUrl(data.audioUrl || null);

      if (data.verified || (typeof data.score === "number" && data.score > 0)) {
        const addedScore = typeof data.score === "number" ? data.score : 0;
        setGlobalScore((prev) => prev + addedScore);

        if (data.voucher) {
          setEarnedVoucher(data.voucher);
          api.fetchVouchers(getUserId()).then(v => setVouchers(v));
        }

        const newScan: Scan = {
          image: imageBase64,
          actionType: data.actionType || "eco-action",
          score: addedScore,
          timestamp: data.timestamp || new Date().toISOString(),
          username: userProfile?.username,
          avatar: userProfile?.avatar
        };
        setScans((prev) => [newScan, ...prev].slice(0, 10));
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
        // Reset and play generated feedback audio if available.
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });
      }
    } catch (err: any) {
      console.error(err);
      setFeedback("Something went wrong. Please try again.");
      setVerified(false);
    } finally {
      if (progressInterval!) clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const simulateSuccess = async () => {
    setLoading(true);
    setProgress(0);
    setFeedback(null);
    setVerified(null);
    setScore(null);

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      if (p > 90) p = 90;
      setProgress(p);
    }, 100);

    try {
      const data = await api.verifyAction({
        simulated: true,
        userId: getUserId(),
        username: userProfile?.username,
        avatar: userProfile?.avatar
      });

      clearInterval(interval);
      setProgress(100);
      setLoading(false);

      if (data.verified) {
        setVerified(true);
        setScore(data.score);
        setFeedback(data.message);
        setGlobalScore(s => s + (data.score || 0));

        if (data.voucher) {
          setEarnedVoucher(data.voucher);
          await api.fetchVouchers(getUserId()).then(v => setVouchers(v));
        }

        await fetchLeaderboardAndStats();
        confettiPromise.then(c => c({ particleCount: 100, spread: 70, origin: { y: 0.6 } }));
      } else {
        setVerified(false);
        setFeedback(data.message || "Simulation failed.");
      }
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setVerified(false);
      setFeedback("Simulation error: Could not connect to server.");
    }
  };

  const simulateFailure = () => {
    setLoading(true);
    setProgress(0);
    setFeedback(null);
    setVerified(null);

    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      if (p > 100) p = 100;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setLoading(false);
        setVerified(false);
        setScore(null);
        setFeedback("Simulated Failure: We couldn't verify that action.");
      }
    }, 200);
  };

  const Header = () => (
    <header className="flex items-center justify-between mb-10 pt-4 px-1">
      {/* Left: Logo */}
      <div className="flex items-center gap-3 group cursor-default">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/5 flex items-center justify-center border border-emerald-500/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
          <Leaf className="w-7 h-7 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-400">
            EcoVerify
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-emerald-500/60 font-bold tracking-widest uppercase">Saver Mode</p>
          </div>
        </div>
      </div>

      {/* Right: Score & Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500/60 font-black mb-1">Global Impact</span>
          <div className="flex items-center gap-2 bg-white/5 dark:bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-white/10 dark:border-emerald-500/10 shadow-sm transition-all hover:bg-white/10">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500 animate-bounce-slow" />
              <span className="text-lg font-black text-emerald-500 tabular-nums">
                {globalScore.toLocaleString()}
              </span>
            </div>
            {/* User Rank Display */}
            {userRank && (
              <div className="flex items-center gap-1 pl-2 ml-2 border-l border-white/10">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">#</span>
                <span className="text-base font-black text-neutral-300">{userRank}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile condensed score */}
        <div className="sm:hidden flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-black text-emerald-100">{globalScore}</span>
        </div>

        <ThemeToggle />

        {/* Profile Icon */}
        <div
          onClick={() => setShowProfileModal(true)}
          className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/20 transition-all relative group shadow-lg overflow-hidden"
        >
          {userProfile?.avatar || <User className="w-6 h-6 text-emerald-500/50" />}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
        </div>

        {/* Feedback Button */}
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/20 transition-all shadow-lg group"
          title="Give Feedback"
        >
          <MessageSquare className="w-6 h-6 text-purple-500/50 group-hover:text-purple-500" />
        </button>
      </div>
    </header>
  );

  return (
    <div className="w-full max-w-md mx-auto pb-24">
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} totalVerifiedUsers={globalVerifiedUsers} totalVouchers={globalVouchersCount} />}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        username={userProfile?.username}
      />
      <Header />

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 dark:bg-black/20 rounded-xl mb-6 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab("verify")}
          className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "verify" ? "bg-emerald-600 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"}`}
        >
          <Camera className="w-4 h-4" />
          Home
        </button>
        <button
          onClick={() => {
            setActiveTab("leaderboard");
            fetchLeaderboardAndStats();
          }}
          className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "leaderboard" ? "bg-amber-600 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"}`}
        >
          <Trophy className="w-4 h-4" />
          Leaderboard
        </button>
        <button
          onClick={() => {
            setActiveTab("vouchers");
            fetchVouchers();
          }}
          className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all relative ${activeTab === "vouchers" ? "bg-purple-600 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"}`}
        >
          <Ticket className="w-4 h-4" />
          Vouchers
          {loadingVouchers ? (
            <span className="absolute -top-1 -right-1 bg-purple-500 text-white p-1 rounded-full border border-black shadow animate-spin">
              <Loader2 className="w-2.5 h-2.5" />
            </span>
          ) : vouchers.filter(v => !v.used).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black shadow">
              {vouchers.filter(v => !v.used).length}
            </span>
          )}
        </button>
      </div>

      {/* Global Stats (Subtle) */}
      <div className="flex justify-center mb-6">
        {globalVouchersCount > 1 && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
            <Ticket className="w-3.5 h-3.5 text-emerald-500/60" />
            <span className="text-xs font-medium text-emerald-600/60 dark:text-emerald-400/60">
              <span className="font-bold">{globalVouchersCount.toLocaleString()}</span> vouchers awarded globally
            </span>
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
      ) : (
        <>
          {/* Main Action Card */}
          <div className="apple-card relative overflow-hidden mb-8 group">
            <div className="p-6 flex flex-col items-center justify-center min-h-[320px] relative z-10 text-center">

              <div className="mb-6 relative">
                <div className="w-20 h-20 rounded-full bg-[var(--glass-bg)] flex items-center justify-center border border-[var(--glass-border)] mb-4 mx-auto">
                  <Leaf className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Verify Action</h2>
                <p className="text-sm text-neutral-400 max-w-[240px] mx-auto leading-relaxed">
                  Take a photo of your eco-friendly habit to verify and earn points.
                </p>
              </div>

              <button
                onClick={triggerFileInput}
                disabled={loading}
                className="primary-btn rounded-full px-8 py-4 flex items-center gap-3 text-lg shadow-lg shadow-emerald-900/20 hover:bg-emerald-600 hover:text-white transition-all"
              >
                <Camera className="w-5 h-5" />
                {loading ? "Scanning..." : "Verify"}
              </button>

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
                <p className="text-[10px] text-neutral-500 max-w-[200px]">
                  {isPublic
                    ? "Verified actions are shared publicly in the activity feed."
                    : "Private actions still earn points but won't be shown in the feed."}
                </p>
              </div>

            </div>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 transition-all duration-500">
                <div className="relative w-24 h-24 mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="4" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} transform="rotate(-90 50 50)" className="transition-all duration-300 ease-out" />
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

          {/* Feedback Toast / Card */}
          {(feedback || verified !== null) && (
            <div className={`apple-card p-5 mb-8 flex flex-col gap-3 transition-all duration-300 ${verified ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-red-500/30 bg-red-950/20'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${verified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {verified ? <Leaf className="w-4 h-4" /> : <div className="w-4 h-4 rounded-sm border-2 border-current" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${verified ? 'text-emerald-400' : 'text-red-400'}`}>
                      {verified ? "Verified!" : "Could not verify"}
                    </p>
                    {feedback && <p className="text-sm text-neutral-300 leading-snug mt-1">{feedback}</p>}
                  </div>
                </div>
                {verified && typeof score === "number" && (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex flex-col items-center bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
                      <span className="text-[10px] uppercase text-neutral-500 font-bold">Score</span>
                      <span className="text-xl font-bold text-emerald-400 tabular-nums">+{score}</span>
                    </div>
                    {!userProfile && (
                      <button onClick={() => setShowProfileModal(true)} className="text-[10px] text-emerald-500 underline decoration-emerald-500/30 hover:text-emerald-400">
                        Claim Points
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Dynamic reward display if a voucher was unlocked. */}
              {earnedVoucher && (
                <div className="mt-3 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Ticket className="w-16 h-16 rotate-12 text-purple-400" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-1">Reward Unlocked!</p>
                  <h4 className="text-lg font-bold text-white mb-1">{earnedVoucher.title}</h4>
                  <p className="text-xs text-neutral-400 mb-3">{earnedVoucher.description}</p>
                  <div className="flex items-center justify-between bg-black/40 rounded px-3 py-2 border border-purple-500/20">
                    <code className="font-mono text-purple-300 font-bold">{earnedVoucher.code}</code>
                    <button onClick={() => setActiveTab("vouchers")} className="text-[10px] bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded transition-colors">
                      View Wallet
                    </button>
                  </div>
                </div>
              )}

              {audioUrl && (
                <div className="mt-2 bg-black/20 rounded-lg p-2">
                  <audio ref={audioRef} src={audioUrl} controls className="w-full h-8 opacity-80 hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          )}

          {/* Recent Feed */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Recent Activity</h3>
            </div>

            {scans.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <p className="text-neutral-500 text-sm">No scans yet. Be the first!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {scans.map((scan, idx) => (
                  <div key={idx} className="glass-panel p-3 flex items-center gap-4 hover:bg-white/5 transition-colors flex-shrink-0">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {/* User Avatar or Placeholder Image */}
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 bg-neutral-800 flex items-center justify-center text-xl relative z-10">
                        <img src={`data:image/jpeg;base64,${scan.image}`} alt="opt" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-900 border border-black flex items-center justify-center z-20 overflow-hidden text-xs">
                        {scan.avatar || "👤"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 ml-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-neutral-200">{scan.username || "Anonymous"}</span>
                        <span className="text-[10px] text-white/20">•</span>
                        <span className="text-xs text-neutral-400">{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-emerald-400/80 capitalize font-medium">{scan.actionType.replace(/-/g, ' ')}</p>
                    </div>
                    <div className="bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full text-xs font-bold tabular-nums border border-[var(--primary)]/20">
                      +{scan.score}
                    </div>
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteScan(idx)}
                      className="ml-1 p-1.5 text-neutral-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group/del"
                      title="Remove from your view"
                    >
                      <User className="w-3.5 h-3.5 group-hover/del:hidden" />
                      <span className="hidden group-hover/del:inline text-[10px] font-bold">✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Claim Your Profile</h2>
              <p className="text-sm text-neutral-400">Save your username to appear on the leaderboard.</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-emerald-500/50 flex items-center justify-center text-4xl shadow-lg shadow-emerald-900/20">
                {selectedAvatar}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-white/10 transition-colors ${selectedAvatar === avatar ? "bg-white/20 ring-2 ring-emerald-500" : ""}`}
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
                    className="flex-1 bg-neutral-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    onClick={generateRandomName}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-neutral-400"
                  >
                    🎲
                  </button>
                </div>
                {/* Availability Feedback */}
                <div className="h-4 mt-1 pl-1">
                  {isCheckingUsername ? (
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                    </span>
                  ) : usernameAvailable === true ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      ✓ Username available
                    </span>
                  ) : usernameAvailable === false ? (
                    <span className="text-xs text-red-400 flex items-center gap-1">
                      ✕ Username taken
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                onClick={saveProfile}
                disabled={!inputUsername.trim() || usernameAvailable === false || isCheckingUsername}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Profile
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-300"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 py-8 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-2 mb-2 opacity-60">
          <Leaf className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-semibold text-neutral-400">EcoVerify</span>
        </div>
        <p className="text-xs text-neutral-600">
          © 2026 EcoVerify. Built for the Planet. <br />
          Made by <a href="https://me.devpete.co.uk" target="_blank" rel="noopener noreferrer" className="text-emerald-600/80 hover:text-emerald-500 hover:underline transition-all">Pete</a> and <a href="https://github.com/pavan2005" target="_blank" rel="noopener noreferrer" className="text-emerald-600/80 hover:text-emerald-500 hover:underline transition-all">Pavan</a>
        </p>
      </footer>
    </div>
  );
}
