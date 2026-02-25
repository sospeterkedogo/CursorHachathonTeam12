export const AVATARS_DATA = [
    { id: "emerald", label: "Emerald Orb", color: "from-emerald-400 to-emerald-700", emoji: "🌿" },
    { id: "sapphire", label: "Sapphire Orb", color: "from-blue-400 to-blue-700", emoji: "👤" },
    { id: "ruby", label: "Ruby Orb", color: "from-red-400 to-red-700", emoji: "🍄" },
    { id: "amber", label: "Amber Orb", color: "from-amber-400 to-amber-700", emoji: "🐝" },
    { id: "amethyst", label: "Amethyst Orb", color: "from-purple-400 to-purple-700", emoji: "🦋" },
    { id: "quartz", label: "Quartz Orb", color: "from-rose-300 to-rose-500", emoji: "🐨" },
    { id: "topaz", label: "Topaz Orb", color: "from-yellow-300 to-yellow-500", emoji: "🦁" },
    { id: "obsidian", label: "Obsidian Orb", color: "from-neutral-700 to-neutral-900", emoji: "🐼" },
    { id: "silver", label: "Silver Orb", color: "from-neutral-300 to-neutral-500", emoji: "🐧" },
    { id: "sunset", label: "Sunset Orb", color: "from-orange-400 to-pink-500", emoji: "🦊" }
];

export const AVATARS = AVATARS_DATA.map(a => a.id);

export const STORED_IMAGES = [
    {
        id: "recycling",
        url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format",
        label: "Recycling Station"
    },
    {
        id: "reusable",
        url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=600&auto=format",
        label: "Reusable Mug"
    },
    {
        id: "solar",
        url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600&auto=format",
        label: "Solar Panels"
    },
    {
        id: "bicycle",
        url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=600&auto=format",
        label: "Zero-Emission Transit"
    },
    {
        id: "plants",
        url: "https://images.unsplash.com/photo-1599309015934-8b64b38d3856?q=80&w=600&auto=format",
        label: "Nature Conservation"
    }
];

export const API_PATHS = {
    VERIFY: "/api/verify",
    LEADERBOARD: "/api/leaderboard",
    VOUCHERS: "/api/vouchers",
    REDEEM: "/api/vouchers/redeem",
    USER: "/api/user",
    FEEDBACK: "/api/feedback"
};

export const UI_CHUNKS = {
    ADJECTIVES: ["Green", "Eco", "Clean", "Leafy", "Solar", "Windy", "Ocean", "Forest"],
    NOUNS: ["Panda", "Fox", "Hero", "Warrior", "Guardian", "Scout", "Ranger", "Spirit"]
};
