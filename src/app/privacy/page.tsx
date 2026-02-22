import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <a href="/verify" className="inline-flex items-center gap-2 text-emerald-600 font-bold mb-8 hover:opacity-70 transition-opacity">
                    <ArrowLeft className="w-4 h-4" />
                    Back to App
                </a>

                <header className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Privacy Policy</h1>
                        <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Last Updated: February 2026</p>
                    </div>
                </header>

                <div className="glass-panel p-8 space-y-8 border-neutral-200 dark:border-white/5">
                    <section>
                        <h2 className="text-xl font-bold mb-4">1. Data We Collect</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            EcoVerify collects images you upload for verification, your chosen username, and avatar. We also store your ecological impact score and verification history. All image analysis is performed using AI to ensure compliance with sustainability goals.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">2. AI Image Analysis</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            We use MiniMax Vision AI to analyze your photos. These images are transmitted securely to our AI providers solely for verification purposes. We do not use your images for marketing or identify you personally through facial recognition.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">3. Data Visibility</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            By default, your ecological actions are public and visible on the Global Feed to inspire others. You can choose to keep any action private ("Visible only to me") at the time of verification or later via your Profile tab.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">4. Your Rights</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            You have the right to delete your actions permanently from our database. Deleting an action will remove all associated data and adjust your total ecological score accordingly.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-neutral-100 dark:border-white/5">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold text-center">
                            EcoVerify — Built for a greener future.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
