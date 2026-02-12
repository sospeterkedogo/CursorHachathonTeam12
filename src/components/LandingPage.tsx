'use client';

import { useState } from "react";
import Link from "next/link";

// Value sections (no icons)
const VALUE_SECTIONS = [
  {
    id: "never-spam",
    title: "Never Guess Again",
    benefit:
      "AI verifies your eco action from a single photo — recycling, lights-off, reusables — so every point you earn is real and meaningful.",
    testimonial: "Finally an app that actually verifies what I do. No more guessing.",
    author: "Alex K.",
    role: "Sustainability Lead",
    company: "GreenTech",
  },
  {
    id: "ai-optimizes",
    title: "AI Optimizes Every Verification",
    benefit:
      "Our vision AI scores each action (10–100 points) based on impact and type, so you see exactly how much you're contributing.",
    testimonial: "The scoring feels fair and motivates my team to do more.",
    author: "Jordan M.",
    role: "Team Lead",
    company: "EcoStart",
  },
  {
    id: "track-engagement",
    title: "Track Real-Time Impact",
    benefit:
      "See your personal score, streak, and the global impact feed. Know where you stand and watch the community grow.",
    testimonial: "Seeing my streak and the global number keeps me coming back.",
    author: "Sam R.",
    role: "Community Manager",
    company: "Impact Hub",
  },
  {
    id: "integrate",
    title: "Join a Global Community",
    benefit:
      "Your verified actions show up in the live feed. Compete on points, share wins, and feel part of something bigger.",
    testimonial: "Love seeing what others are doing. It's like a green social feed.",
    author: "Casey L.",
    role: "Founder",
    company: "PlanetFirst",
  },
];

const TESTIMONIALS = [
  { name: "Alex Kim", title: "Sustainability Lead", company: "GreenTech", quote: "Eco-Verify turned our office green habits into a game. We actually see who's doing what." },
  { name: "Jordan Miller", title: "Team Lead", company: "EcoStart", quote: "The AI verification is spot-on. Every point is earned. Our team doubled actions in a month." },
  { name: "Sam Rivera", title: "Community Manager", company: "Impact Hub", quote: "Real-time impact feed and personal score changed how we think about sustainability." },
  { name: "Casey Liu", title: "Founder", company: "PlanetFirst", quote: "Finally, a tool that makes going green measurable and fun. Team challenges every week." },
  { name: "Morgan Taylor", title: "Head of Operations", company: "CleanFuture", quote: "Setup in minutes. We had our first verified action before the end of the demo." },
  { name: "Riley Chen", title: "Product Manager", company: "EcoScale", quote: "The streak and badges keep everyone accountable. Never had this level of engagement." },
];

export default function LandingPage() {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Eco-Verify",
            description: "AI-powered eco action verification. Turn every green action into points.",
            url: typeof window !== "undefined" ? window.location.origin : "",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              bestRating: "5",
              ratingCount: "2000",
            },
            review: TESTIMONIALS.map((t) => ({
              "@type": "Review",
              author: { "@type": "Person", name: t.name },
              reviewBody: t.quote,
            })),
          }),
        }}
      />

      <div className="min-h-screen flex flex-col w-full max-w-[1200px] mx-auto">
        {/* Hero */}
        <section id="hero" className="relative flex flex-col items-center justify-center px-5 py-16 md:py-24 overflow-hidden w-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.08),transparent_45%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-black" />

          <div className="relative z-10 w-full text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-50 tracking-tight leading-[1.1]">
              Turn Every Eco Action Into Impact in Seconds
            </h1>
            <p className="text-lg md:text-xl text-emerald-200/85 leading-relaxed">
              We verify your green actions with AI so you earn points, track your impact, and join a global community — no signup required.
            </p>

            <p className="text-sm text-emerald-300/80">
              4.9/5 from 2,000+ users · Trusted by 15,000+ eco actions verified
            </p>

            <div className="flex flex-col items-center gap-4 pt-2">
              <Link
                href="/app"
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
                className={`apple-btn-primary inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-emerald-950 shadow-lg hover:scale-[1.03] hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${ctaHovered ? "translate-x-0.5" : ""}`}
              >
                Start Verifying — It&apos;s Free →
              </Link>
              <p className="text-xs text-emerald-200/70 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                <span>No signup required</span>
                <span>Free forever</span>
                <span>Start in 30 seconds</span>
              </p>
            </div>

            <div className="pt-10 w-full max-w-2xl mx-auto">
              <div className="apple-card p-6 bg-gradient-to-br from-emerald-900/40 via-slate-950/80 to-black">
                <p className="text-sm font-medium text-emerald-200/90">Your impact at a glance</p>
                <p className="text-xs text-emerald-200/70 mt-1">Score · Stats · Streak · Live Feed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Value sections */}
        {VALUE_SECTIONS.map((section, idx) => (
          <section key={section.id} id={section.id} className="relative py-16 md:py-20 px-5 border-t border-white/5 w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/5 to-black" />
            <div className="relative z-10 w-full max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-50 mb-3">{section.title}</h2>
              <p className="text-emerald-100/80 leading-relaxed mb-6">{section.benefit}</p>
              <blockquote className="apple-card p-4 border-l-2 border-emerald-500/50">
                <p className="text-sm text-emerald-100/90 italic">&ldquo;{section.testimonial}&rdquo;</p>
                <footer className="mt-2 text-xs text-emerald-200/70">
                  — {section.author}, {section.role}, {section.company}
                </footer>
              </blockquote>
            </div>
          </section>
        ))}

        {/* CTA section */}
        <section id="cta" className="relative py-20 md:py-24 px-5 border-t border-white/5 w-full scroll-mt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/20 to-black" />
          <div className="relative z-10 w-full max-w-lg mx-auto text-center space-y-8">
            <p className="text-emerald-200/80 text-sm uppercase tracking-widest">Join 15,000+ people making an impact</p>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-50">Start Verifying Your Eco Actions Today</h2>
            <p className="text-emerald-200/80">No form, no signup. Click below and snap your first action.</p>
            <Link
              href="/app"
              className="apple-btn-primary inline-block rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-emerald-950 shadow-lg hover:scale-[1.03] hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black text-center"
            >
              Get My Free Trial →
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative py-20 md:py-24 px-5 border-t border-white/5 w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950/10 to-black" />
          <div className="relative z-10 w-full max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-50 mb-4">Loved by teams who care</h2>
            <p className="text-center text-emerald-200/70 mb-12 max-w-lg mx-auto">
              See what others say about turning green actions into measurable impact.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <article key={i} className="apple-card p-6 flex flex-col" itemScope itemType="https://schema.org/Review">
                  <div className="mb-4">
                    <p className="font-semibold text-emerald-50" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <span itemProp="name">{t.name}</span>
                    </p>
                    <p className="text-xs text-emerald-200/70">{t.title}, {t.company}</p>
                  </div>
                  <p className="text-sm text-emerald-100/85 leading-relaxed flex-1" itemProp="reviewBody">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-xs text-emerald-400/80 mt-3">Verified</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative py-16 px-5 border-t border-white/5 w-full">
          <div className="relative z-10 w-full max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-50">Ready to make an impact?</h2>
            <Link
              href="/app"
              className="apple-btn-primary inline-block rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-emerald-950 shadow-lg hover:scale-[1.03] hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black text-center"
            >
              Start Verifying Actions →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
