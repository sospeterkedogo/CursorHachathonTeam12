import {
    Coffee,
    GraduationCap,
    Building2,
    Home,
    PlusCircle,
    Camera,
    Trophy
} from "lucide-react";

export const FEEDBACK_HISTORY = [
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
    },
    {
        date: "Sun, 22 Feb 2026",
        feedback: "Good UI and onboarding. Value prop is unclear what's the long-term use? Also, the system can be gamed with stock photos.",
        response: "Most valuable feedback yet. Tightening core logic early is a huge win. I've re-done the UI to make goals more visible and addressed the 'gaming' concerns.",
        fixes: ["Anti-Stock Image Guardrails", "Value Prop UI Overhaul", "Dynamic Goal Visibility"]
    },
    {
        date: "Sun, 22 Feb 2026",
        feedback: "Great initiative! Clean simple UI. I wish I could see the AI feedback for others on the leaderboard. Love the new voice feature!",
        response: "Happy to hear the voice feature helps! AI transparency for community posts is a great suggestion for our upcoming Social Layer updates.",
        fixes: ["AI Feedback Transparency", "Community AI Insights", "Accessibility Voice Polish"]
    }
];

export const CAREER_ROLES = [
    { title: "Marketing & Growth", desc: "Drive users from online platforms and manage global reach." },
    { title: "Database & Records", desc: "Scale our Imperial Ledger and manage sustainability data." },
    { title: "UI/UX Designers", desc: "Help us define the high-end aesthetic of green tech." },
    { title: "Content Creators", desc: "Tell the story of our community's global impact." },
    { title: "Affiliate Marketers", desc: "Partner with brands to bring real-world rewards." }
];

export const USE_CASES = [
    { icon: Coffee, title: "Cafes & Dining", desc: "Verify compostable cups or plant-based choices while eating out.", impact: "+12 Points" },
    { icon: GraduationCap, title: "Schools & Campus", desc: "Audit recycling habits in dorms or lecture halls.", impact: "+15 Points" },
    { icon: Building2, title: "Corporate Offices", desc: "Track sustainable paper use and energy-saving actions.", impact: "+20 Points" },
    { icon: Home, title: "At Home", desc: "Easily categorize waste into the right bin and log daily composting or energy audits.", impact: "+10 Points" }
];

export const GETTING_STARTED = [
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
