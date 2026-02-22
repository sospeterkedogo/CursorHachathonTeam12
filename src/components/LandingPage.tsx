'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  MessageSquare,
  Code,
  Users,
  Mail,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
  Timer,
  CheckCircle2,
  Trophy,
  Target,
  Rocket,
  PlusCircle,
  Camera,
  Bookmark,
  Coffee,
  GraduationCap,
  Building2,
  Home,
  Sun,
  Moon,
  Loader2,
  TrendingUp,
  TrendingDown,
  Coins,
  BarChart3,
  Globe2,
  Monitor
} from "lucide-react";

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

const FEEDBACK_HISTORY = [
  {
    date: "Fri, 13 Feb 2026",
    feedback: "Attached images showing 101% while analyzing. Unclear image privacy. Missing delete functionality. Rewards for non-eco pics.",
    response: "Huge thanks for the brutal honesty. I'm working on a Zero Points for Trash update and a live camera stream. Rewards shop preview added.",
    fixes: ["Fixed 'Yes-Man' AI prompt", "Added 'Zero Points for Trash' logic", "Implemented accessibility voice feature"]
  },
  {
    date: "Sat, 21 Feb 2026",
    feedback: "The UI is so simple, I hope it would be luxury. Android and iOS versions?",
    response: "Just made the UI update of your life. Luxury theme deployed. Mobile apps are in development.",
    fixes: ["Luxury 'Imperial' Design System", "Glassmorphism & Gold accents", "Refined mobile-first layout"]
  }
];

const CAREER_ROLES = [
  { title: "Marketing & Growth", desc: "Drive users from online platforms and manage global reach." },
  { title: "Database & Records", desc: "Scale our Imperial Ledger and manage sustainability data." },
  { title: "UI/UX Designers", desc: "Help us define the high-end aesthetic of green tech." },
  { title: "Content Creators", desc: "Tell the story of our community's global impact." },
  { title: "Affiliate Marketers", desc: "Partner with brands to bring real-world rewards." }
];

const USE_CASES = [
  { icon: Coffee, title: "Cafes & Dining", desc: "Verify compostable cups or plant-based choices while eating out.", impact: "+12 Points" },
  { icon: GraduationCap, title: "Schools & Campus", desc: "Audit recycling habits in dorms or lecture halls.", impact: "+15 Points" },
  { icon: Building2, title: "Corporate Offices", desc: "Track sustainable paper use and energy-saving actions.", impact: "+20 Points" },
  { icon: Home, title: "At Home", desc: "Easily categorize waste into the right bin and log daily composting or energy audits.", impact: "+10 Points" }
];

const GETTING_STARTED = [
  {
    step: "01",
    title: "Secure Your Identity",
    desc: "Choose an avatar and save your username to join the EcoVerify community.",
    icon: PlusCircle
  },
  {
    step: "02",
    title: "Eco-Audit Scan",
    desc: "Snap any green action. Our AI analyzes the ecological impact in real-time.",
    icon: Camera
  },
  {
    step: "03",
    title: "Imperial Rewards",
    desc: "Earn points and CO2 credits. Redeem for vouchers from elite eco-partners including upcoming major retailers like M&S and Amazon.",
    icon: Trophy
  }
];

function ThemeToggle({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  return (
    <button
      onClick={onToggleTheme}
      className={`fixed top-6 right-6 z-[100] p-3 rounded-full transition-all duration-500 shadow-2xl ${isDark ? 'bg-white/5 text-neutral-400 hover:text-white border-white/10 hover:bg-white/10' : 'bg-black/5 text-neutral-500 hover:text-black border-black/10 hover:bg-black/10'} border backdrop-blur-md group active:scale-90`}
    >
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      {isDark ? <Sun className="relative z-10 w-5 h-5 transition-transform group-hover:rotate-45" /> : <Moon className="relative z-10 w-5 h-5 transition-transform group-hover:-rotate-12" />}
    </button>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: 30 days from now for demonstration
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });

      if (distance < 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 sm:gap-8 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 luxury-card flex items-center justify-center mb-2">
            <span className="text-xl sm:text-2xl luxury-data text-emerald-500">{value}</span>
          </div>
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{unit}</span>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage({ stats, communityScans }: LandingPageProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLogoNavigating, setIsLogoNavigating] = useState(false);

  useEffect(() => {
    // Sync with html body class for globals.css themes
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Prefetch app route to warm up transition
    router.prefetch('/verify');
  }, [isDark, router]);

  const handleTryNow = () => {
    setIsNavigating(true);
    router.push('/verify');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#050505] text-white' : 'bg-[#fdfdfd] text-neutral-900'} selection:bg-emerald-500/30 overflow-x-hidden`}>
      <ThemeToggle isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />

      {/* Background Elements */}
      <div className={`fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] ${isDark ? 'from-emerald-500/10 via-black to-black' : 'from-emerald-500/5 via-white to-white'}`} />
      <div className={`fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-emerald-500/5 to-transparent -z-10 blur-3xl opacity-30`} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl space-y-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl luxury-heading tracking-tight leading-tight px-4 pb-2">
            Sustainability <br />
            <span className="text-luxury-gold italic inline-block pr-8">Redefined</span>
          </h1>

          <div className="space-y-4">
            <p className={`text-lg md:text-xl ${isDark ? 'text-neutral-400' : 'text-neutral-500'} max-w-2xl mx-auto font-light tracking-wide leading-relaxed`}>
              Stop hoping you're making a difference. <span className="text-emerald-500 font-medium">Start knowing you are.</span>
            </p>
          </div>



          <div className="flex flex-col items-center gap-6 pt-8">
            <button
              onClick={handleTryNow}
              disabled={isNavigating}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              className="group relative px-10 py-5 rounded-2xl bg-emerald-500 text-black font-bold text-lg overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20 disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center gap-3">
                {isNavigating ? (
                  <>Experience the App <Loader2 className="w-5 h-5 animate-spin" /></>
                ) : (
                  <>Experience the App <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </button>
            <p className="text-[10px] text-neutral-500 uppercase tracking-[0.4em] font-black flex items-center gap-4">
              <span>Action</span>
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>Proof</span>
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>Impact</span>
            </p>
            <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] font-medium pt-2">
              No Sign-up Required • Verified by AI
            </p>
          </div>
        </motion.div>

        {/* Floating Mobile Tease */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 py-3 px-6 luxury-card border-white/5 animate-bounce">
          <Smartphone className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Android & iOS coming soon</span>
        </div>
      </section>

      {/* Dynamic Milestones Section */}
      <section className={`max-w-6xl mx-auto px-6 py-20 border-y ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-black/5 bg-black/[0.01]'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="text-center space-y-2">
            <div className="text-2xl md:text-4xl luxury-data text-luxury-gold">{(stats?.totalScore || 0).toLocaleString()}</div>
            <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Imperial Points</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl md:text-4xl luxury-data text-emerald-500">{(stats?.totalGlobalCO2 || 0).toFixed(2)}kg</div>
            <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">CO2 Extinguished</div>
          </div>
          <div className="text-center space-y-2">
            <div className={`text-2xl md:text-4xl luxury-data ${isDark ? 'text-white' : 'text-neutral-900'}`}>{(stats?.totalVerifiedUsers || 0).toLocaleString()}</div>
            <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Elite Contributors</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl md:text-4xl luxury-data text-purple-400">{(stats?.totalVouchers || 0).toLocaleString()}</div>
            <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Vouchers Issued</div>
          </div>
        </div>

        {/* Global Goal Progress bar */}
        <div className="mt-16 max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1 text-left">
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Global Road to 1M</p>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light`}>Join the community in reaching our 2027 milestone.</p>
            </div>
            <div className={`text-[10px] luxury-data ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {(((stats?.totalVerifiedUsers || 0) / 1000000) * 100).toFixed(4)}%
            </div>
          </div>
          <div className={`h-1 w-full ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-full overflow-hidden`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, ((stats?.totalVerifiedUsers || 0) / 1000000) * 100)}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </div>
        </div>
      </section>

      {/* What / Why / Goal Section */}
      <section id="mission" className="max-w-6xl mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-12">
            <div className="space-y-6">
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3">
                <Target className="w-4 h-4" /> The Mission
              </h2>
              <h3 className="text-4xl md:text-5xl luxury-heading leading-tight">Auditing the Planet, <br /> One Snap at a Time.</h3>
              <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed max-w-xl`}>
                EcoVerify is a sophisticated AI-powered sustainability ledger. We believe environmental action should be as rewarding as it is impactful. Our goal is to verify **1 Million** eco-actions by 2027, creating a global standard for personal sustainability auditing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-luxury-gold/10' : 'bg-luxury-gold/5'} flex items-center justify-center`}>
                  <Rocket className="w-6 h-6 text-luxury-gold" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest">Why we do it</h4>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed font-light`}>To bridge the gap between intent and impact through gamified verification.</p>
              </div>
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'} flex items-center justify-center`}>
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest">The Goal</h4>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed font-light`}>Creating a verifiable record of humanity's small wins for the planet.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className={`luxury-card p-2 relative overflow-hidden group shadow-2xl transition-all duration-700 ${isDark ? 'border-white/5 bg-black/40' : 'border-black/5 bg-white/40'}`}>
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
              <img
                src="/screenshots/Untitled3.png"
                alt="Auditing the Planet"
                className="w-full h-auto rounded-lg grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-70 group-hover:opacity-100 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Audit Anywhere</h2>
          <h3 className="text-4xl luxury-heading">Where can I use EcoVerify?</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {USE_CASES.map((useCase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`luxury-card p-8 group transition-colors ${isDark ? 'border-white/5 hover:bg-emerald-500/5' : 'border-black/5 hover:bg-emerald-500/5'}`}
            >
              <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <useCase.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-4">{useCase.title}</h4>
              <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed font-light mb-6`}>
                {useCase.desc}
              </p>
              <div className="text-[10px] luxury-data text-luxury-gold uppercase tracking-[0.2em]">
                {useCase.impact}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className={`text-xs ${isDark ? 'text-neutral-600' : 'text-neutral-400'} italic font-light`}>
            "Works perfectly at school, at work, in corporate buildings, cafes, or even while traveling."
          </p>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'} relative overflow-hidden`}>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] -z-10" />

        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3 space-y-8">
            <h3 className="text-4xl luxury-heading">Getting <br />Started</h3>
            <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
              Joining the Imperial Series is seamless. Use it anywhere, anytime.
              Bookmarking the app ensures you never miss a chance to audit your impact.
            </p>
            <div className={`flex items-center gap-4 py-4 px-6 luxury-card ${isDark ? 'border-emerald-500/10 bg-emerald-500/5' : 'border-emerald-500/20 bg-emerald-500/10'} mb-8`}>
              <Bookmark className="w-5 h-5 text-emerald-500" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pro Tip</p>
                <p className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light uppercase tracking-widest`}>Add to Home Screen for easy access.</p>
              </div>
            </div>

            <button
              onClick={handleTryNow}
              className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-emerald-500/20 group"
            >
              <span className="flex items-center justify-center gap-2">
                Join the Movement <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {GETTING_STARTED.map((item, i) => (
              <div key={i} className="space-y-6 relative group">
                <div className={`text-6xl luxury-data ${isDark ? 'text-white/5' : 'text-black/5'} absolute -top-10 -left-4 pointer-events-none group-hover:text-emerald-500/10 transition-colors duration-500`}>{item.step}</div>
                <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'} border flex items-center justify-center relative z-10 group-hover:border-emerald-500/30 transition-colors`}>
                  <item.icon className={`w-6 h-6 ${isDark ? 'text-white/60' : 'text-black/60'} group-hover:text-emerald-500 transition-colors`} />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-luxury-gold rounded-full border-2 border-black scale-0 group-hover:scale-100 transition-transform duration-500" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest relative z-10 group-hover:text-emerald-500 transition-colors">{item.title}</h4>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed font-light relative z-10 group-hover:text-white transition-colors`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Evidence Section */}
      {communityScans && communityScans.length > 0 && (
        <section className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="text-center mb-16 space-y-4">
            <h2 className={`text-[10px] font-black ${isDark ? 'text-emerald-500' : 'text-emerald-600'} uppercase tracking-[0.4em]`}>Real-Time Impact</h2>
            <h3 className="text-4xl luxury-heading">Community Evidence</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {communityScans.map((scan) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`luxury-card overflow-hidden group ${isDark ? 'border-white/5' : 'border-black/5'}`}
              >
                <div className={`h-24 relative overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                  <img src={scan.image} alt={scan.actionType} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500/80 text-white text-[6px] font-black uppercase tracking-widest border border-white/20">
                    {scan.actionType}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between min-h-[120px]">
                  <div className="space-y-3">
                    <div className="flex gap-1.5">
                      <MessageSquare className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                      <p className={`text-[11px] ${isDark ? 'text-white/90' : 'text-neutral-800'} font-medium leading-relaxed italic line-clamp-4`}>
                        "{scan.message}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                    <div className="space-y-0.5">
                      <p className="text-[7px] font-black text-luxury-gold uppercase tracking-widest">Points</p>
                      <p className="luxury-data text-[10px] text-luxury-gold">+{scan.score || 0}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Saved</p>
                      <p className="luxury-data text-[10px] text-emerald-500">{(scan.co2_saved || 0).toFixed(1)}kg</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Imperial Health Section */}
      <section id="health" className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'} relative overflow-hidden`}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] -z-10" />

        <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h2 className={`text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-3`}>
                <Zap className="w-4 h-4" /> Imperial Health
              </h2>
              <h3 className="text-4xl md:text-5xl luxury-heading leading-tight italic">Passive Impact. <br /> Total Privacy.</h3>
              <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
                The upcoming Imperial Mobile app integrates directly with your existing fitness ecosystem.
                Automatically audit your daily activity and earn rewards for low-carbon transportation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'} flex items-center justify-center`}>
                  <Smartphone className="w-5 h-5 text-emerald-500" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest">Global Ecosystem</h4>
                <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'} font-light leading-relaxed`}>Connect Google Fit, Apple Health, Fitbit, and Garmin effortlessly.</p>
              </div>
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'} flex items-center justify-center`}>
                  <Timer className="w-5 h-5 text-luxury-gold" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest">Passive Milestones</h4>
                <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'} font-light leading-relaxed`}>Earn **+50 Imperial Points** automatically for every 6,000 steps walked daily.</p>
              </div>
            </div>

            <div className={`p-6 luxury-card ${isDark ? 'border-emerald-500/10 bg-emerald-500/5' : 'border-emerald-500/20 bg-emerald-500/10'} flex items-center gap-4`}>
              <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] font-medium tracking-wide uppercase italic">Runs in the background. Audits while you live. Zero effort sustainability.</p>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className={`luxury-card ${isDark ? 'border-white/5 bg-black/40' : 'border-black/5 bg-white/40'} p-2 relative overflow-hidden group shadow-2xl transition-all duration-700`}>
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
              <img
                src="/screenshots/Untitled2.png"
                alt="Imperial Profile"
                className="w-full h-auto rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />

            </div>
          </div>
        </div>
      </section>

      {/* Impact Economics Section */}
      <section className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'} relative overflow-hidden`}>
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-20 space-y-4 relative z-10">
          <h2 className={`text-[10px] font-black ${isDark ? 'text-emerald-500' : 'text-emerald-600'} uppercase tracking-[0.4em]`}>Global Scale</h2>
          <h3 className="text-4xl md:text-5xl luxury-heading">Impact <span className="text-luxury-gold">Economics</span></h3>
          <p className={`max-w-2xl mx-auto text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'} font-light leading-relaxed`}>
            Our current linear economy is leaking value. EcoVerify is the protocol for capturing the hidden
            billions in our waste streams through verified citizen audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative z-10">
          {[
            {
              title: "Annual Landfill",
              value: "2.12B",
              unit: "TONNES",
              desc: "Global waste generation is accelerating towards a breaking point.",
              icon: TrendingUp,
              color: "text-red-500/60"
            },
            {
              title: "Capital Lost",
              value: "£200B+",
              unit: "£/YR",
              desc: "Massive public spending on inefficient, contaminated waste management.",
              icon: Coins,
              color: "text-luxury-gold"
            },
            {
              title: "Circular Value",
              value: "£120B",
              unit: "£ UNLOCKED",
              desc: "The untapped value of correctly sorted materials in the circular economy.",
              icon: BarChart3,
              color: "text-emerald-500"
            }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 luxury-card flex flex-col justify-between group h-full ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}
            >
              <div className="space-y-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-black/5'} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">{stat.title}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl text-white luxury-data">{stat.value}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${stat.color}`}>{stat.unit}</span>
                  </div>
                </div>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed font-light`}>
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Protocol of Truth (Manifesto) */}
        <div className="mt-40 space-y-20 relative">
          <div className="text-center space-y-6">
            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">The End of the Promise</h2>
            <h3 className="text-4xl md:text-6xl luxury-heading italic">The Protocol <span className="text-luxury-gold">of Truth</span></h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`luxury-card p-10 space-y-8 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.01]'}`}>
              <div className="space-y-4">
                <span className="text-4xl luxury-data text-white/10">01</span>
                <h4 className="text-xl luxury-heading">No More Guesswork</h4>
              </div>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
                Sustainability has relied on the "Honor System" for too long. But the planet doesn't run on good feelings—it runs on the cold, hard math of carbon.
              </p>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed italic border-l border-emerald-500/30 pl-4`}>
                If we can’t prove the impact, it didn't happen.
              </p>
            </div>

            <div className={`luxury-card p-10 space-y-8 ${isDark ? 'bg-emerald-500/[0.03]' : 'bg-emerald-500/[0.01]'} border-emerald-500/20`}>
              <div className="space-y-4">
                <span className="text-4xl luxury-data text-emerald-500/20">02</span>
                <h4 className="text-xl luxury-heading">The Math of Impact</h4>
              </div>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
                Environmental action should be as clear as a bank statement. We use AI to turn physical effort into digital proof. Total clarity. Zero doubt.
              </p>
              <div className={`p-6 rounded-2xl ${isDark ? 'bg-black/40' : 'bg-white/40'} border border-white/5 font-serif italic text-center text-luxury-gold text-lg`}>
                V<sub>impact</sub> = ∑ (A<sub>i</sub> × C<sub>i</sub>) · Φ
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Φ = Verification Coefficient</p>
                <p className="text-[8px] text-neutral-600 uppercase tracking-widest">Ensures zero-knowledge proof of genuine action.</p>
              </div>
            </div>

            <div className={`luxury-card p-10 space-y-8 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.01]'}`}>
              <div className="space-y-4">
                <span className="text-4xl luxury-data text-white/10">03</span>
                <h4 className="text-xl luxury-heading">The Power of Proof</h4>
              </div>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
                Accountability is the most premium resource we have. EcoVerify is for those who realize that the planet deserves more than a promise.
              </p>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
                The planet deserves more than a promise. <span className="text-emerald-500">It deserves proof.</span>
              </p>
            </div>
          </div>
        </div>

        {/* The Multiplier Effect */}
        <div className={`mt-32 luxury-card p-12 md:p-20 relative overflow-hidden ${isDark ? 'bg-emerald-500/[0.02]' : 'bg-emerald-500/[0.04]'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">The Multiplier Effect</h4>
                <h3 className="text-3xl luxury-heading italic">Small Wins. <span className="text-luxury-gold">Compounded.</span></h3>
                <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
                  A single verified action seems small. But when 10,000 citizens audit a container correctly,
                  contamination drops by 40%. This single shift increases material value by 3x.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "1 Verified Audit", value: "The Seed", detail: "Correct sorting starts at the source." },
                  { label: "1,000 Audits", value: "System Shift", detail: "Contamination levels fall below critical thresholds." },
                  { label: "1 Million+", value: "Circular Era", detail: "Waste becomes raw material. Value is recaptured." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <span className="text-[8px] font-black text-emerald-500">{i + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                        <div className="h-px w-4 bg-white/10" />
                        <span className="text-[10px] font-black text-luxury-gold uppercase tracking-widest">{step.value}</span>
                      </div>
                      <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'} font-light`}>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className={`aspect-square rounded-full border border-white/5 flex items-center justify-center relative ${isDark ? 'bg-white/[0.01]' : 'bg-black/[0.01]'}`}>
                <div className="absolute inset-0 bg-emerald-500/5 blur-[60px] animate-pulse" />
                <div className="text-center space-y-4 relative z-10">
                  <Globe2 className="w-16 h-16 text-emerald-500/40 mx-auto mb-6" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Total Savings Goal</p>
                    <p className="text-5xl luxury-data text-white">£40B</p>
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Global Value Recovery</p>
                  </div>
                </div>

                {/* Floating Labels */}
                <div className="absolute -top-4 -right-4 p-4 luxury-card bg-black/60 backdrop-blur-md border-emerald-500/20">
                  <p className="text-[8px] font-black text-emerald-500">EFFICIENCY</p>
                  <p className="text-lg luxury-data">+84%</p>
                </div>
                <div className="absolute -bottom-8 left-1/4 p-4 luxury-card bg-black/60 backdrop-blur-md border-luxury-gold/20">
                  <p className="text-[8px] font-black text-luxury-gold">CONTAMINATION</p>
                  <p className="text-lg luxury-data">-42%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Reward Network Section */}
      <section className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-black/5 bg-black/[0.01]'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-emerald-500/[0.02] blur-[150px] pointer-events-none" />
        <div className="text-center space-y-6 relative z-10 mb-20">
          <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">The Digital Handshake</h2>
          <h3 className="text-4xl md:text-5xl luxury-heading italic">The Reward <span className="text-luxury-gold">Network</span></h3>
          <p className={`max-w-2xl mx-auto text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'} font-light leading-relaxed`}>
            We are working with global leaders and local heroes to bridge the gap between action and impact.
            Earning real-world value for real-world change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className={`luxury-card p-10 space-y-6 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.01]'}`}>
            <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} flex items-center justify-center`}>
              <Building2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white">Global Retailers</h4>
            <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed font-light`}>
              Securing integrations with platforms like **Amazon** and **M&S** for universal digital vouchers.
            </p>
          </div>

          <div className={`luxury-card p-10 space-y-6 ${isDark ? 'bg-emerald-500/[0.03]' : 'bg-emerald-500/[0.01]'} border-emerald-500/20 shadow-emerald-500/5`}>
            <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'} flex items-center justify-center`}>
              <Coins className="w-6 h-6 text-luxury-gold" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white">Daily Essentials</h4>
            <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed font-light`}>
              Negotiating with major grocery stores and locations to turn your eco-points into daily savings.
            </p>
          </div>

          <div className={`luxury-card p-10 space-y-6 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.01]'}`}>
            <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} flex items-center justify-center`}>
              <Briefcase className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white">Brand Ecosystem</h4>
            <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed font-light`}>
              A growing list of huge retailers committed to rewarding zero-knowledge verified impact.
            </p>
          </div>
        </div>
      </section>


      {/* Digital Experience Section */}
      <section className={`max-w-7xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'} relative overflow-hidden`}>
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="text-center mb-20 space-y-4 relative z-10">
          <h2 className={`text-[10px] font-black ${isDark ? 'text-emerald-500' : 'text-emerald-600'} uppercase tracking-[0.4em]`}>Digital Artifacts</h2>
          <h3 className="text-4xl md:text-5xl luxury-heading">The <span className="text-luxury-gold">Experience</span></h3>
          <p className={`max-w-2xl mx-auto text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'} font-light leading-relaxed`}>
            A meticulously crafted interface designed for the next generation of eco-auditors.
            Native speed, high-fidelity visuals, and deep metric transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
          {[
            {
              title: "Verified Auditing",
              desc: "Snap, verify, and log impact in seconds with our high-performance mobile UI.",
              src: "/screenshots/IMG_3349.PNG",
              tag: "Mobile Native"
            },
            {
              title: "Global Ledger",
              desc: "Real-time visibility into collective gains and imperial milestones.",
              src: "/screenshots/Untitled.png",
              tag: "Imperial Core"
            },
            {
              title: "Community Scaling",
              desc: "Compete with elite auditors on the decentralized global leaderboard.",
              src: "/screenshots/Untitled1.png",
              tag: "Social Layer"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6 group"
            >
              <div className={`luxury-card p-2 aspect-[4/5] overflow-hidden ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'} relative`}>
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-1000"
                />

              </div>
              <div className="space-y-2 px-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-white group-hover:text-emerald-500 transition-colors">{item.title}</h4>
                <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'} font-light leading-relaxed`}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 flex justify-center">
          <div className={`inline-flex items-center gap-8 py-4 px-8 luxury-card ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}>
            <div className="flex items-center gap-3">
              <Monitor className="w-4 h-4 text-neutral-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Desktop Optimized</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-neutral-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">iOS & Android Ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <div className={`luxury-card ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'} p-12 md:p-20 text-center relative overflow-hidden`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-emerald-500 to-transparent" />

          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-8" />
            <h3 className="text-3xl md:text-4xl luxury-heading">Privacy is not a <br /><span className="text-luxury-gold">Luxury</span>. It's a standard.</h3>
            <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
              At EcoVerify, your data is yours. We use end-to-end encryption for all audit images and health data.
              GPS data is never stored, and your personal identity is masked by the Imperial Series ledger.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">AES-256 Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Zero-Knowledge Proof</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Launch Countdown Section */}
      <section id="mobile" className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent' : 'border-black/5 bg-gradient-to-b from-black/[0.01] to-transparent'}`}>
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.4em] flex items-center justify-center gap-3">
              <Timer className="w-4 h-4" /> Next Generation Mobile
            </h2>
            <h3 className="text-4xl md:text-6xl luxury-heading">Imperial Mobile Drop</h3>
          </div>

          <CountdownTimer />

          <div className="max-w-md mx-auto space-y-8">
            <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
              Be the first to audit from your pocket. Pre-register your interest for early access to the Android and iOS elite beta.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className={`flex-1 ${isDark ? 'bg-white/5 border-white/10 focus:border-emerald-500/50' : 'bg-black/5 border-black/10 focus:border-emerald-500/50'} rounded-xl px-6 py-4 text-sm font-light focus:outline-none transition-colors`}
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-emerald-500 text-black font-bold text-sm rounded-xl hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                >
                  Pre-Register
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 luxury-card ${isDark ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-500/40 bg-emerald-500/10'} flex flex-col items-center gap-4`}
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-widest mb-1">On the List</p>
                  <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>We'll invite you as soon as we drop.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Feedback & Evolution Section */}
      <section className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                <MessageSquare className="w-4 h-4" /> Lab Notes & Feedback
              </h2>
              <h3 className="text-4xl luxury-heading">Brutally Honest Evolution</h3>
            </div>
            <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light leading-relaxed`}>
              We believe in radical transparency. Every update is driven by our community on the Indie App Circle.
              We don't just fix bugs; we refine experiences.
            </p>
            <div className={`p-6 luxury-card ${isDark ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-500/40 bg-emerald-500/10'} space-y-6`}>
              <p className={`text-sm italic ${isDark ? 'text-emerald-200/80' : 'text-emerald-900/80'}`}>
                "Tiny team, massive impact. Scaling the world's most elegant Eco-Friendly Auditor."
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} flex items-center justify-center text-[10px] font-bold`}>SK</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Sospeter Kedogo • Lead Developer</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} flex items-center justify-center text-[10px] font-bold`}>PR</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Pavan Rohith • CM & Lead Ops</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {FEEDBACK_HISTORY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`luxury-card p-8 space-y-6 ${isDark ? 'border-white/5' : 'border-black/5'}`}
              >
                <div className={`flex items-center justify-between border-b ${isDark ? 'border-white/5' : 'border-black/5'} pb-4`}>
                  <span className="luxury-data text-[10px] text-luxury-gold uppercase tracking-[0.2em]">{item.date}</span>
                  <Code className={`w-4 h-4 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`} />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Tester Feedback</h4>
                    <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'} leading-relaxed font-light italic`}>"{item.feedback}"</p>
                  </div>
                  <div className="pl-4 border-l-2 border-emerald-500/30">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Our Response</h4>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'} leading-relaxed font-light`}>{item.response}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.fixes.map((fix, j) => (
                      <span key={j} className={`text-[9px] px-2 py-1 rounded ${isDark ? 'bg-white/5 border-white/10 text-neutral-500' : 'bg-black/5 border-black/10 text-neutral-400'} uppercase tracking-wider font-bold`}>
                        {fix}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className={`max-w-6xl mx-auto px-6 py-32 border-t ${isDark ? 'border-white/5' : 'border-black/5'} relative`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-5xl luxury-heading">Open to <span className="text-luxury-gold">Collaboration</span></h2>
          <p className={`${isDark ? 'text-neutral-400' : 'text-neutral-500'} font-light max-w-xl mx-auto leading-relaxed`}>
            We're building the infrastructure for a greener future. Whether you're a developer,
            a designer, or a brand, let's create something meaningful together.
          </p>
          <div className="flex justify-center pt-4">
            <a
              href="mailto:kedogosospeter36@gmail.com"
              className={`flex items-center gap-3 px-8 py-4 luxury-card ${isDark ? 'hover:border-emerald-500/30' : 'hover:border-emerald-500/50'} transition-all group`}
            >
              <Mail className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="luxury-data text-xs uppercase tracking-[0.2em]">Send Skill/CV</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-1 luxury-card flex flex-col overflow-hidden ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div className="aspect-video w-full relative overflow-hidden group">
              <img
                src="/screenshots/Untitled3.png"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-90"
                alt="Imperial Mission"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-8">
                <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-white/10' : 'bg-black/10'} backdrop-blur-md flex items-center justify-center border border-white/10`}>
                  <Briefcase className="w-6 h-6 text-luxury-gold" />
                </div>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-2xl luxury-heading">Join the <br />Mission</h3>
              <p className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'} font-light leading-relaxed`}>
                We are currently onboarding a new team member. Explore our active roles below.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CAREER_ROLES.map((role, i) => (
              <div key={i} className={`p-6 luxury-card transition-colors group ${isDark ? 'hover:bg-white/5 border-white/5' : 'hover:bg-black/5 border-black/5'}`}>
                <h4 className="luxury-data text-xs uppercase tracking-widest text-emerald-500 mb-3 flex items-center justify-between">
                  {role.title}
                  <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'} leading-relaxed font-light`}>{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-20 px-6 border-t ${isDark ? 'border-white/5' : 'border-black/5'} text-center`}>
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-6">
            <Smartphone className={`w-5 h-5 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`} />
            <div className={`h-px w-12 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <div className={`h-px w-12 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
            <Sparkles className={`w-5 h-5 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`} />
          </div>
          <div className="space-y-4">
            <p className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-neutral-900'} uppercase tracking-[0.6em]`}>ECOVERIFY • IMPERIAL SERIES</p>
            <p className={`text-[9px] ${isDark ? 'text-neutral-600' : 'text-neutral-400'} font-medium tracking-[0.3em] leading-loose`}>
              © 2026 AUDITING THE PLANET • PETE & PAVAN <br />
              LONDON • NEW YORK • DUBAI
            </p>
          </div>
        </div>
      </footer>
    </div >
  );
}
