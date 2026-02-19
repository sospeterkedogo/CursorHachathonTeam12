export type Scan = {
    _id?: string;
    userId?: string;
    image: string;
    actionType: string;
    score: number;
    timestamp: string;
    username?: string;
    avatar?: string;
    isPublic?: boolean;
    status?: 'pending' | 'completed' | 'failed';
    message?: string;
};

export type LeaderboardEntry = {
    rank?: number;
    userId: string;
    username: string;
    avatar: string;
    totalScore: number;
};

export type Voucher = {
    _id: string;
    code: string;
    title: string;
    description: string;
    expiry: string;
    createdAt: string;
    used?: boolean;
};

export type VisionResult = {
    verified: boolean;
    score?: number;
    actionType?: string;
    message: string;
};

export type EcoVerifyClientProps = {
    initialTotalScore: number;
    initialScans: Scan[];
    initialLeaderboard: LeaderboardEntry[];
    itemOne: number;
    itemTwo: number;
};

export type OnboardingProps = {
    onComplete: () => void;
    totalVerifiedUsers: number;
    totalVouchers: number;
};

export type LeaderboardProps = {
    entries: LeaderboardEntry[];
    currentUserId: string | null;
    loading?: boolean;
};

export type VoucherListProps = {
    vouchers: Voucher[];
    loading?: boolean;
    onActivate?: (id: string) => void;
};
