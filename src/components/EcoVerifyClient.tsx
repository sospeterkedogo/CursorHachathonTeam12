'use client';

import { useRef, useState, useEffect } from "react";
import { Camera, Loader2, Leaf, Trophy, User } from "lucide-react";
import dynamic from "next/dynamic";
import { getUserId } from "@/lib/userId";
import { ThemeToggle } from "./ThemeToggle";
import Onboarding from "./Onboarding";
import Leaderboard from "./Leaderboard";

const confettiPromise = import("canvas-confetti").then((m) => m.default);

// Helper to prevent [object Object] in UI
const ensureString = (msg: any): string => {
  if (typeof msg === "string") return msg;
  if (!msg) return "";
  if (typeof msg === "object") {
    return msg.message || msg.error || msg.details || JSON.stringify(msg);
  }
  return String(msg);
};

type Scan = {
  image: string;
  actionType: string;
  score: number;
  timestamp: string;
  username?: string;
  avatar?: string;
};

type LeaderboardEntry = {
  rank?: number;
  userId: string;
  username: string;
  avatar: string;
  totalScore: number;
};

type Props = {
  initialTotalScore: number;
  initialScans: Scan[];
  initialLeaderboard: LeaderboardEntry[];
};

const AVATARS = ["🐼", "🦊", "🦁", "🐰", "🐸", "🐯", "🐨", "🐙", "🦄", "🐲"];

export default function EcoVerifyClient({ initialTotalScore, initialScans, initialLeaderboard }: Props) {
  const [activeTab, setActiveTab] = useState<"verify" | "leaderboard">("verify");
  const [globalScore, setGlobalScore] = useState(initialTotalScore);
  const [scans, setScans] = useState<Scan[]>(initialScans);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // User Profile State
  const [userProfile, setUserProfile] = useState<{ username: string; avatar: string } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [inputUsername, setInputUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load local profile
    const savedName = localStorage.getItem("eco_username");
    const savedAvatar = localStorage.getItem("eco_avatar");
    if (savedName && savedAvatar) {
      setUserProfile({ username: savedName, avatar: savedAvatar });
      setInputUsername(savedName);
      setSelectedAvatar(savedAvatar);
    }
  }, []);

  const saveProfile = async () => {
    if (!inputUsername.trim()) return;

    const userId = getUserId();
    const newProfile = { username: inputUsername, avatar: selectedAvatar };

    setUserProfile(newProfile);
    localStorage.setItem("eco_username", inputUsername);
    localStorage.setItem("eco_avatar", selectedAvatar);
    setShowProfileModal(false);

    // Sync to backend
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...newProfile })
      });
      // Refresh leaderboard
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const generateRandomName = () => {
    const adjs = ["Green", "Eco", "Clean", "Leafy", "Solar", "Windy", "Ocean", "Forest"];
    const nouns = ["Panda", "Fox", "Hero", "Warrior", "Guardian", "Scout", "Ranger", "Spirit"];
    const randomName = `${adjs[Math.floor(Math.random() * adjs.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 99)}`;
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

  const submitImage = async (imageBase64: string) => {
    let progressInterval: NodeJS.Timeout;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      setLoading(true);
      setProgress(0);
      setFeedback(null);
      setVerified(null);
      setScore(null);
      setAudioUrl(null);

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.floor(Math.random() * 10) + 5;
        });
      }, 500);

      let data;
      try {
        const userId = getUserId();
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: imageBase64,
            userId,
            username: userProfile?.username,
            avatar: userProfile?.avatar
          }),
          signal: controller.signal
        });

        if (!res.ok) {
          throw new Error("Verification request failed");
        }
        data = await res.json();
      } catch (innerError) {
        console.warn("Verification API failed/timed out, using client fallback", innerError);
        data = {
          verified: true,
          score: 60,
          actionType: "eco-action",
          message: "We faced a connection hiccup, but here's some points for your effort!",
          timestamp: new Date().toISOString()
        };
      }

      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      setProgress(100);

      setVerified(data.verified);
      setScore(typeof data.score === "number" ? data.score : null);
      setFeedback(ensureString(data.message));
      setAudioUrl(data.audioUrl || null);

      if (data.verified) {
        const addedScore = typeof data.score === "number" ? data.score : 0;
        setGlobalScore((prev) => prev + addedScore);

        const newScan: Scan = {
          image: imageBase64,
          actionType: data.actionType || "eco-action",
          score: addedScore,
          timestamp: data.timestamp || new Date().toISOString(),
          username: userProfile?.username,
          avatar: userProfile?.avatar
        };
        setScans((prev) => [newScan, ...prev].slice(0, 10));

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

        // Always refresh leaderboard to show updated score
        fetch("/api/leaderboard")
          .then(r => r.json())
          .then(d => {
            if (d.leaderboard) setLeaderboard(d.leaderboard);
          })
          .catch(console.error);

        if (data.audioUrl && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => { });
        }
      }
    } catch (err: any) {
      console.error(err);
      setFeedback("Something went wrong. Please try again.");
      setVerified(false);
    } finally {
      if (progressInterval!) clearInterval(progressInterval);
      setLoading(false);
      clearTimeout(timeoutId);
    }
  };

  const simulateSuccess = () => {
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
        setVerified(true);
        setScore(85);
        setFeedback("Simulated Success: Great job recycling!");
        setGlobalScore(s => s + 85);
        confettiPromise.then(c => c({ particleCount: 100, spread: 70, origin: { y: 0.6 } }));
      }
    }, 200);
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
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2" onClick={() => setShowProfileModal(true)}>
        <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xl cursor-pointer hover:border-emerald-500/50 transition-colors">
          {userProfile?.avatar || <User className="w-5 h-5 text-neutral-500" />}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight leading-none cursor-pointer hover:text-emerald-400 transition-colors">
            {userProfile?.username || "Guest"}
          </h1>
          <p className="text-xs text-neutral-500">Tap to edit profile</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="glass-panel px-4 py-2 flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Total Impact</span>
          <span className="text-xl font-bold text-[var(--primary)] tabular-nums">{globalScore}</span>
        </div>
      </div>
    </header>
  );

  return (
    <div className="w-full max-w-md mx-auto pb-24">
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      <Header />

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 dark:bg-black/20 rounded-xl mb-6 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab("verify")}
          className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "verify" ? "bg-emerald-600 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"}`}
        >
          <Camera className="w-4 h-4" />
          Verify
        </button>
        <button
          onClick={() => {
            setActiveTab("leaderboard");
            fetch("/api/leaderboard").then(r => r.json()).then(d => setLeaderboard(d.leaderboard)).catch(() => { });
          }}
          className={`flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "leaderboard" ? "bg-amber-600 text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"}`}
        >
          <Trophy className="w-4 h-4" />
          Leaderboard
        </button>
      </div>

      {activeTab === "leaderboard" ? (
        <Leaderboard entries={leaderboard} currentUserId={getUserId()} />
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
                className="primary-btn rounded-full px-8 py-4 flex items-center gap-3 text-lg shadow-lg shadow-emerald-900/20"
              >
                <Camera className="w-5 h-5" />
                {loading ? "Scanning..." : "Open Camera"}
              </button>

              <p className="mt-4 text-xs text-neutral-600">Supports Camera & Gallery</p>
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
              <div className="flex flex-col gap-3">
                {scans.map((scan, idx) => (
                  <div key={idx} className="glass-panel p-3 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {/* User Avatar or Placeholder Image */}
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 bg-neutral-800 flex items-center justify-center text-xl relative z-10">
                        {scan.avatar || "👤"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-900 border border-black flex items-center justify-center z-20 overflow-hidden">
                        <img src={`data:image/jpeg;base64,${scan.image}`} alt="opt" className="w-full h-full object-cover opacity-80" />
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
                    title="Randomize"
                  >
                    🎲
                  </button>
                </div>
              </div>

              <button
                onClick={saveProfile}
                disabled={!inputUsername.trim()}
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

      {/* Dev Tools */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 pt-6 border-t border-white/5 opacity-50 hover:opacity-100 transition-opacity">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-neutral-600 font-bold text-center">Developer Controls</p>
          <div className="flex justify-center gap-2">
            <button onClick={simulateSuccess} className="px-4 py-2 text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 rounded-lg hover:bg-emerald-900/50">
              Simulate Success
            </button>
            <button onClick={simulateFailure} className="px-4 py-2 text-xs bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/50">
              Simulate Failure
            </button>
            <button
              onClick={() => {
                const userId = getUserId();
                fetch(`/api/admin/migrate?targetUserId=${userId}`)
                  .then(r => r.json())
                  .then(d => {
                    alert(d.message);
                    window.location.reload();
                  })
                  .catch(e => alert(e.message));
              }}
              className="px-4 py-2 text-xs bg-blue-900/30 text-blue-400 border border-blue-900/50 rounded-lg hover:bg-blue-900/50"
            >
              Sync Legacy Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
