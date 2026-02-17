import { ArrowLeft, Scale } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <a href="/" className="inline-flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:opacity-70 transition-opacity">
                    <ArrowLeft className="w-4 h-4" />
                    Back to App
                </a>

                <header className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Terms of Service</h1>
                        <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest">Last Updated: February 2026</p>
                    </div>
                </header>

                <div className="glass-panel p-8 space-y-8 border-neutral-200 dark:border-white/5">
                    <section>
                        <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            By using EcoVerify, you agree to these terms. EcoVerify is a hackathon project designed to promote ecological awareness through AI verification of sustainable actions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">2. Proper Use</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            You agree to only upload authentic photos of your own ecological actions. Attempting to "game" the system with fake images, duplicated uploads, or inappropriate content is strictly prohibited.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">3. Points and Rewards</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Points and vouchers issued by EcoVerify are for demonstration purposes and have no real-world cash value. We reserve the right to audit scores and remove points earned through gallery uploads or non-compliant behavior.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">4. Limitation of Liability</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            EcoVerify is provided "as is." We are not responsible for any misuse of the application or for the accuracy of AI-generated sustainability feedback.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-neutral-100 dark:border-white/5 text-center">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                            Thank you for helping us save the planet, one action at a time.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
