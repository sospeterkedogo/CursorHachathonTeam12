'use client';

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserId } from "@/lib/userId";
import Onboarding from "./Onboarding";

import dynamic from "next/dynamic";
import { EcoVerifyClientProps } from "@/types";
import { STORED_IMAGES } from "@/constants";
import * as api from "@/lib/api";

// Hooks
import { useVouchers } from "@/hooks/use-vouchers";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useEcoActions } from "@/hooks/use-eco-actions";

// Components
import { Header } from "./eco-verify/Header";
import { BottomNav } from "./eco-verify/BottomNav";
import { GlobalBanner, GoalCard } from "./eco-verify/ImpactSummary";
import { WeeklyImpactSummary } from "./eco-verify/WeeklyImpactSummary";
const HowItWorks = dynamic(() => import("./eco-verify/HowItWorks"));
const VerificationSection = dynamic(() => import("./eco-verify/VerificationSection"));
import { ProfileModal } from "./eco-verify/ProfileModal";
import { GalleryModal } from "./eco-verify/GalleryModal";
import { Lightbox } from "./eco-verify/Lightbox";
import FeedbackModal from "./FeedbackModal";

// Lazy-loaded components for performance
const Leaderboard = dynamic(() => import("./Leaderboard"), {
  loading: () => <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
});
const VoucherList = dynamic(() => import("./VoucherList"), {
  loading: () => <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
});
const ActivityFeed = dynamic(() => import("./eco-verify/ActivityFeed"));
const ProfileView = dynamic(() => import("./eco-verify/ProfileView"), {
  loading: () => <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
});
import GlobalInsights from "./eco-verify/GlobalInsights";

export default function EcoVerifyClient({ initialTotalScore, initialGlobalCO2, initialScans, initialLeaderboard, itemOne, itemTwo }: EcoVerifyClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"verify" | "leaderboard" | "vouchers" | "profile" | "insights">("verify");
  const [globalScore, setGlobalScore] = useState(initialTotalScore);
  const [globalCO2, setGlobalCO2] = useState(initialGlobalCO2);
  const [userScore, setUserScore] = useState(0); // Personal score 4 goal progress
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [globalVerifiedUsers, setGlobalVerifiedUsers] = useState(itemOne);
  const [globalVouchersCount, setGlobalVouchersCount] = useState(itemTwo);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [nextBestAction, setNextBestAction] = useState<any>(null);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNavigatingToHome, setIsNavigatingToHome] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Custom Hooks
  const { vouchers, loadingVouchers, fetchVouchers, handleActivateVoucher } = useVouchers();
  const {
    userProfile, setUserProfile, showProfileModal, setShowProfileModal,
    inputUsername, setInputUsername, selectedAvatar, setSelectedAvatar,
    isCheckingUsername, usernameAvailable, saveProfile, handleClearCache,
    handleDeleteAccount, userRank, setUserRank
  } = useUserProfile();

  const {
    scans, userActivity, loadingActivity, fetchUserActivity,
    deleteScan, handleToggleVisibility, submitImage, loading,
    progress, feedback, verified, score, audioUrl, earnedVoucher,
    lastCapturedImage, hasMoreActivity, activityPage
  } = useEcoActions(initialScans, userProfile);

  useEffect(() => {
    const hideOnboarding = localStorage.getItem("eco-hide-onboarding");
    if (!hideOnboarding) {
      setShowOnboarding(true);
    }
    setIsMounted(true);
    fetchLeaderboardAndStats(); // Fetch updated stats on mount

    // Prefetch landing page for seamless return
    router.prefetch('/');
  }, []);

  const fetchLeaderboardAndStats = async () => {
    try {
      const data = await api.fetchLeaderboard(getUserId());
      setLeaderboard(data.leaderboard);
      if (typeof data.totalVerifiedUsers === 'number') setGlobalVerifiedUsers(data.totalVerifiedUsers);
      if (typeof data.totalVouchers === 'number') setGlobalVouchersCount(data.totalVouchers);
      if (typeof data.userRank === 'number') setUserRank(data.userRank);
      if (data.userData && typeof data.userData.totalScore === 'number') setUserScore(data.userData.totalScore);

      // Update Global Stats
      if (typeof data.totalGlobalPoints === 'number') setGlobalScore(data.totalGlobalPoints);
      if (typeof data.totalGlobalCO2 === 'number') setGlobalCO2(data.totalGlobalCO2);

      // Fetch Personal Stats for Weekly Trend and NBA
      try {
        const statsData = await api.fetchPersonalStats(getUserId());
        if (statsData.weeklyTrend) setWeeklyTrend(statsData.weeklyTrend);
        if (statsData.nextBestAction) setNextBestAction(statsData.nextBestAction);
      } catch (err) {
        console.error("Failed to fetch personal detailed stats", err);
      }

    } catch (e) {
      console.error("Failed to fetch leaderboard/stats", e);
    }
  };

  const handleVerificationSuccess = (data: any) => {
    if (data.verified || (typeof data.score === "number" && data.score > 0)) {
      setGlobalScore(prev => prev + (data.score || 0));
      setGlobalCO2(prev => prev + (data.co2_saved || 0));
      setUserScore(prev => prev + (data.score || 0));

      fetchLeaderboardAndStats();
      if (data.voucher) {
        fetchVouchers();
      }
      setCurrentPage(0);
      if (!userProfile) {
        setTimeout(() => setShowProfileModal(true), 1500);
      }
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      submitImage(base64, "camera", handleVerificationSuccess);
    };
    reader.readAsDataURL(file);
  };

  const selectGalleryImage = async (url: string) => {
    setShowImageGallery(false);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        submitImage(base64, "gallery", handleVerificationSuccess);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Failed to load gallery image", err);
    }
  };

  return (
    <div className="w-full pb-32 overflow-x-hidden min-h-screen selection:bg-luxury-gold/30">
      <AnimatePresence>
        {isNavigatingToHome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center animate-pulse shadow-2xl shadow-emerald-500/40">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-4 border border-emerald-500/20 rounded-3xl animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Returning to HQ</p>
              <div className="h-0.5 w-32 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="h-full w-full bg-emerald-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-black to-black" />
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-500/10 to-transparent -z-10 blur-3xl opacity-30" />

      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} totalVerifiedUsers={globalVerifiedUsers} totalVouchers={globalVouchersCount} />}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        username={userProfile?.username}
      />

      <Header
        userProfile={userProfile}
        onShowFeedback={() => setShowFeedbackModal(true)}
        onShowProfile={() => setShowProfileModal(true)}
        onHomeClick={() => {
          setIsNavigatingToHome(true);
          router.push("/");
        }}
      />

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTabChange={(tab) => {
          if (tab === "leaderboard") fetchLeaderboardAndStats();
          if (tab === "vouchers") fetchVouchers();
          if (tab === "profile") fetchUserActivity(0, false);
          if (tab === "insights") fetchLeaderboardAndStats();
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-[calc(4rem+env(safe-area-inset-top,0px))] sm:pt-[calc(6rem+env(safe-area-inset-top,0px))]">
        {/* Dynamic Content Area */}
        <main className="min-h-[80vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            >
              {activeTab === "leaderboard" ? (
                <Leaderboard
                  entries={leaderboard}
                  currentUserId={getUserId()}
                  loading={false}
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
                    onDelete={(id) => deleteScan(id, undefined, (newScore) => {
                      if (typeof newScore === 'number') setGlobalScore(newScore);
                      fetchLeaderboardAndStats();
                    })}
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
                  <div className="flex flex-col items-center justify-center py-40 opacity-50">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-6" />
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Retrieving Ledger...</span>
                  </div>
                )
              ) : activeTab === "insights" ? (
                <GlobalInsights
                  globalScore={globalScore}
                  globalCO2={globalCO2}
                  totalVerifiedUsers={globalVerifiedUsers}
                  weeklyTrend={weeklyTrend}
                  nextBestAction={nextBestAction}
                  userRank={userRank}
                  userScore={userScore}
                />
              ) : (
                <div className="space-y-10 sm:space-y-16">
                  {/* Verification Core Section */}
                  <div className="pt-10 border-t border-white/5">
                    <VerificationSection
                      loading={loading}
                      progress={progress}
                      isPublic={isPublic}
                      setIsPublic={setIsPublic}
                      onTriggerFileInput={triggerFileInput}
                      onShowGallery={() => setShowImageGallery(true)}
                      verified={verified}
                      feedback={feedback}
                      score={score}
                      earnedVoucher={earnedVoucher}
                      audioUrl={audioUrl}
                      audioRef={audioRef}
                      onViewVouchers={() => setActiveTab("vouchers")}
                      onCapture={(base64) => submitImage(base64, "camera", handleVerificationSuccess)}
                      lastCapturedImage={lastCapturedImage}
                    />
                  </div>

                  <div className="pt-12 border-t border-white/5">
                    <div className="flex items-center gap-4 mb-8 sm:mb-12">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                      <h3 className="text-[10px] sm:text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em]">Community Activity</h3>
                    </div>
                    <ActivityFeed
                      scans={scans}
                      currentPage={currentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                      isMounted={isMounted}
                      getUserId={getUserId}
                      onSetLightboxImage={setLightboxImage}
                      onSetCurrentPage={setCurrentPage}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="mt-40 py-16 text-center border-t border-white/5">
          <div className="flex flex-col items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-1000">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-white/20" />
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div className="h-px w-8 bg-white/20" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-4">Imperial Sustainability Index</p>
              <p className="text-[9px] text-neutral-500 font-medium tracking-widest leading-loose">
                © 2026 ECOVERIFY • ALL RIGHTS RESERVED <br />
                CURATED FOR THE PLANET BY PETE & PAVAN
              </p>
            </div>
          </div>
        </footer>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {showProfileModal && (
        <ProfileModal
          inputUsername={inputUsername}
          setInputUsername={setInputUsername}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          isCheckingUsername={isCheckingUsername}
          usernameAvailable={usernameAvailable}
          onGenerateRandomName={() => {
            const adjectives = ["Eco", "Green", "Earth", "Bio", "Nature"];
            const nouns = ["Hero", "Guardian", "Friend", "Warrior", "Spirit"];
            const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 99)}`;
            setInputUsername(randomName);
          }}
          onSaveProfile={() => saveProfile(fetchLeaderboardAndStats)}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showImageGallery && (
        <GalleryModal
          storedImages={STORED_IMAGES}
          onSelectImage={selectGalleryImage}
          onClose={() => setShowImageGallery(false)}
        />
      )}

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
