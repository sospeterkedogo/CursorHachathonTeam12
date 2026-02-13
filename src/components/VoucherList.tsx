import { Ticket, Clock, Calendar } from "lucide-react";

type Voucher = {
    _id: string;
    code: string;
    title: string;
    description: string;
    expiry: string;
    createdAt: string;
};

type Props = {
    vouchers: Voucher[];
    loading?: boolean;
};

export default function VoucherList({ vouchers, loading }: Props) {
    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-panel h-24 animate-pulse bg-white/5" />
                ))}
            </div>
        );
    }

    if (vouchers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <Ticket className="w-12 h-12 mb-4 opacity-20" />
                <p>No vouchers yet.</p>
                <p className="text-sm">Keep verifying actions to earn rewards!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {vouchers.map((voucher) => (
                <div key={voucher._id} className="glass-panel p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Ticket className="w-24 h-24 rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-emerald-400 mb-1">{voucher.title}</h3>
                        <p className="text-sm text-neutral-300 mb-3">{voucher.description}</p>

                        <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between border border-white/5 mb-3">
                            <code className="text-lg font-mono font-bold tracking-wider text-white select-all">
                                {voucher.code}
                            </code>
                            <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest bg-emerald-500/10 px-2 py-1 rounded">
                                ACTIVE
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>Expires: {new Date(voucher.expiry).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
