'use client';

import { useRef, useState, useEffect } from "react";
import { Loader2, Leaf } from "lucide-react";
import { getUserId } from "@/lib/userId";
import Onboarding from "./Onboarding";
import Leaderboard from "./Leaderboard";
import VoucherList from "./VoucherList";
import FeedbackModal from "./FeedbackModal";

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
import { ImpactSummary } from "./eco-verify/ImpactSummary";
import { HowItWorks } from "./eco-verify/HowItWorks";
import { VerificationSection } from "./eco-verify/VerificationSection";
import { ActivityFeed } from "./eco-verify/ActivityFeed";
import { ProfileView } from "./eco-verify/ProfileView";
import { ProfileModal } from "./eco-verify/ProfileModal";
import { GalleryModal } from "./eco-verify/GalleryModal";
import { Lightbox } from "./eco-verify/Lightbox";

export default function EcoVerifyClient({ initialTotalScore, initialScans, initialLeaderboard, itemOne, itemTwo }: EcoVerifyClientProps) {
  const [activeTab, setActiveTab] = useState<"verify" | "leaderboard" | "vouchers" | "profile">("verify");
  const [globalScore, setGlobalScore] = useState(initialTotalScore);
  const [userScore, setUserScore] = useState(0); // Personal score 4 goal progress
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [globalVerifiedUsers, setGlobalVerifiedUsers] = useState(itemOne);
  const [globalVouchersCount, setGlobalVouchersCount] = useState(itemTwo);

  const [showOnboarding, setShowOnboarding] = useState(false);
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
    progress, feedback, verified, score, audioUrl, earnedVoucher
  } = useEcoActions(initialScans, userProfile);

  useEffect(() => {
    const hideOnboarding = localStorage.getItem("eco-hide-onboarding");
    if (!hideOnboarding) {
      setShowOnboarding(true);
    }
    setIsMounted(true);
    fetchLeaderboardAndStats(); // Fetch updated stats on mount
  }, []);

  const fetchLeaderboardAndStats = async () => {
    try {
      const data = await api.fetchLeaderboard(getUserId());
      setLeaderboard(data.leaderboard);
      if (typeof data.totalVerifiedUsers === 'number') setGlobalVerifiedUsers(data.totalVerifiedUsers);
      if (typeof data.totalVouchers === 'number') setGlobalVouchersCount(data.totalVouchers);
      if (typeof data.userRank === 'number') setUserRank(data.userRank);
      if (data.userData && typeof data.userData.totalScore === 'number') setUserScore(data.userData.totalScore);
    } catch (e) {
      console.error("Failed to fetch leaderboard/stats", e);
    }
  };

  const handleVerificationSuccess = (data: any) => {
    if (data.verified || (typeof data.score === "number" && data.score > 0)) {
      setGlobalScore(prev => prev + (data.score || 0));
      setUserScore(prev => prev + (data.score || 0)); // Update personal score immediately
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
    <div className="w-full pb-20 overflow-x-hidden">
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
      />

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTabChange={(tab) => {
          if (tab === "leaderboard") fetchLeaderboardAndStats();
          if (tab === "vouchers") fetchVouchers();
          if (tab === "profile") fetchUserActivity(0, false);
        }}
      />

      <div className="max-w-3xl mx-auto px-4 pt-[calc(5rem+env(safe-area-inset-top,0px))]">
        <div>
          {activeTab === "verify" && !showOnboarding && <HowItWorks />}
          <ImpactSummary globalScore={globalScore} userScore={userScore} userRank={userRank} />
        </div>

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
              hasMore={true}
              onLoadMore={() => { }}
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
            />

            <ActivityFeed
              scans={scans}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              isMounted={isMounted}
              getUserId={getUserId}
              onDeleteScan={deleteScan}
              onSetLightboxImage={setLightboxImage}
              onSetCurrentPage={setCurrentPage}
            />
          </>
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
