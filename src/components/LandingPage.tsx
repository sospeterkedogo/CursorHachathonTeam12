'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

// Critical components loaded traditionally
import HeroSection from "./landing/HeroSection";
import { ThemeToggle } from "./landing/ThemeToggle";

// Lazy-loaded components for performance
const MissionSection = dynamic(() => import("./landing/MissionSection"));
const GettingStartedSection = dynamic(() => import("./landing/GettingStartedSection"));
const MilestonesSection = dynamic(() => import("./landing/MilestonesSection"));
const CommunityEvidenceSection = dynamic(() => import("./landing/CommunityEvidenceSection"), { ssr: false });
const UseCasesSection = dynamic(() => import("./landing/UseCasesSection"));
const ExperienceSection = dynamic(() => import("./landing/ExperienceSection"));
const RewardNetworkSection = dynamic(() => import("./landing/RewardNetworkSection"));
const ImpactEconomicsSection = dynamic(() => import("./landing/ImpactEconomicsSection"));
const ManifestoSection = dynamic(() => import("./landing/ManifestoSection"));
const MultiplierEffectSection = dynamic(() => import("./landing/MultiplierEffectSection"));
const ImperialHealthSection = dynamic(() => import("./landing/ImperialHealthSection"));
const PrivacySection = dynamic(() => import("./landing/PrivacySection"));
const CountdownSection = dynamic(() => import("./landing/CountdownSection"), { ssr: false });
const FeedbackSection = dynamic(() => import("./landing/FeedbackSection"), { ssr: false });
const CollaborationSection = dynamic(() => import("./landing/CollaborationSection"));
const Footer = dynamic(() => import("./landing/Footer"));

interface LandingPageProps {
  stats: {
    totalScore: number;
    totalGlobalCO2: number;
    totalVerifiedUsers: number;
    totalVouchers: number;
  };
  communityScans: Array<{
    id: string;
    image: string;
    actionType: string;
    message: string;
    username: string;
    avatar: string;
    score?: number;
    co2_saved?: number;
  }>;
}

export default function LandingPage({ stats, communityScans }: LandingPageProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Prefetch app route
    router.prefetch('/verify');
  }, [isDark, router]);

  const handleTryNow = () => {
    router.push('/verify');
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 bg-[#fdfdfd] dark:bg-[#050505] text-neutral-900 dark:text-white selection:bg-emerald-500/30 overflow-x-hidden`}>
      <ThemeToggle isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-white to-white dark:from-emerald-500/10 dark:via-black dark:to-black" />
      <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-emerald-500/5 to-transparent -z-10 blur-3xl opacity-30" />

      {/* Page Sections */}
      <HeroSection isDark={isDark} />

      <main>
        <MissionSection />
        <GettingStartedSection handleTryNow={handleTryNow} />
        <MilestonesSection stats={stats} />
        <CommunityEvidenceSection communityScans={communityScans} />
        <UseCasesSection />
        <ExperienceSection />
        <RewardNetworkSection />
        <ImpactEconomicsSection />
        <ManifestoSection />
        <MultiplierEffectSection />
        <ImperialHealthSection />
        <PrivacySection />
        <CountdownSection />
        <FeedbackSection />
        <CollaborationSection />
      </main>

      <Footer />
    </div>
  );
}
