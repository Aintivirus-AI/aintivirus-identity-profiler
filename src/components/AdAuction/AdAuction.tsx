import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ExternalLink, X, Clock, ArrowUp, ArrowDown, ChevronRight, Zap, Eye, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useProfileStore } from '../../store/useProfileStore';
import { LiveConsole } from '../Console/LiveConsole';

interface Bid {
  rank: number;
  company: string;
  amount: number;
  change?: number;
}

const adProfileLinks = [
  { name: 'Google', url: 'https://adssettings.google.com/' },
  { name: 'Facebook', url: 'https://www.facebook.com/adpreferences' },
  { name: 'Microsoft', url: 'https://account.microsoft.com/privacy/ad-settings' },
  { name: 'Twitter/X', url: 'https://twitter.com/settings/your_twitter_data/twitter_interests' },
  { name: 'Amazon', url: 'https://www.amazon.com/adprefs' },
];

export function AdAuction() {
  const [showAdProfiles, setShowAdProfiles] = useState(false);
  const [auctionTime, setAuctionTime] = useState(87);
  const { network, aiAnalysis, trackingDetection, cryptoWallets } = useProfileStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setAuctionTime(prev => prev > 0 ? prev - 1 : 87);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const topBids: Bid[] = [
    { rank: 1, company: 'Coinbase', amount: 2.25, change: 0.15 },
    { rank: 2, company: 'LinkedIn', amount: 2.10, change: 0.08 },
    { rank: 3, company: 'Binance', amount: 1.90, change: -0.05 },
    { rank: 4, company: 'Amazon', amount: 1.80, change: 0.12 },
    { rank: 5, company: 'Brave', amount: 1.75, change: 0.03 },
    { rank: 6, company: 'Trade Desk', amount: 1.60, change: -0.02 },
    { rank: 7, company: 'Indeed', amount: 1.40, change: 0.07 },
    { rank: 8, company: 'Google', amount: 1.25, change: -0.10 },
    { rank: 9, company: 'Meta', amount: 1.15, change: 0.04 },
    { rank: 10, company: 'Microsoft', amount: 1.05, change: -0.03 },
  ];

  const hasCrypto = cryptoWallets.phantom || cryptoWallets.metamask || cryptoWallets.coinbase;
  const hasAdBlocker = trackingDetection.adBlocker;
  const isUS = network.countryCode === 'US';

  const factors = [
    { label: 'Location', value: isUS ? '+80%' : '+20%', active: isUS },
    { label: 'Crypto Wallet', value: '+50%', active: hasCrypto },
    { label: 'Device Tier', value: aiAnalysis.deviceTier === 'premium' ? '+30%' : '+15%', active: aiAnalysis.deviceTier !== 'low-end' },
    { label: 'Ad Blocker', value: '-70%', active: !hasAdBlocker, negative: hasAdBlocker },
  ];

  return (
    <div className="h-full flex flex-col bg-[#07070c]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/90 text-sm font-medium">RTB Auction</span>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <Clock size={12} />
          <span className="text-xs font-mono">{auctionTime}ms</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Winner Section */}
        <div className="px-5 py-8 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-emerald-400/80 mb-1">Winner</div>
              <div className="text-white text-lg font-semibold">{topBids[0].company}</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 text-2xl font-bold font-mono">${topBids[0].amount}</div>
              <div className="flex items-center justify-end gap-1 text-emerald-400/70">
                <ArrowUp size={10} />
                <span className="text-[10px] font-mono">+${topBids[0].change?.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Signal Tag */}
          <div className="mt-5 flex items-center gap-2 text-[11px] text-white/50">
            <Eye size={12} className="text-cyan-400/70" />
            <span>Crypto user • {network.countryCode || 'US'} • {aiAnalysis.deviceTier}</span>
          </div>
        </div>

        {/* Price Factors */}
        <div className="px-5 py-6 border-b border-white/5">
          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-4">Price Factors</div>
          <div className="flex flex-wrap gap-2">
            {factors.map((f) => (
              <div 
                key={f.label}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono ${
                  f.negative 
                    ? 'bg-rose-500/10 text-rose-400/80' 
                    : f.active 
                      ? 'bg-emerald-500/10 text-emerald-400/80' 
                      : 'bg-white/5 text-white/30'
                }`}
              >
                {f.label} <span className="font-semibold">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bid Table */}
        <div className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] uppercase tracking-widest text-white/30">Order Book</div>
            <div className="text-[10px] text-white/20">{topBids.length} bids</div>
          </div>
          
          <div className="space-y-1.5">
            {topBids.map((bid, i) => (
              <motion.div
                key={bid.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center py-3 px-3 rounded-lg ${
                  i === 0 ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : 'hover:bg-white/[0.02]'
                }`}
              >
                <span className="w-6 text-[11px] font-mono text-white/30">{bid.rank}</span>
                <span className="flex-1 text-[13px] text-white/80">{bid.company}</span>
                <span className="text-[13px] font-mono text-white/90 mr-4">${bid.amount.toFixed(2)}</span>
                <span className={`text-[11px] font-mono flex items-center gap-0.5 ${
                  (bid.change ?? 0) >= 0 ? 'text-emerald-400/70' : 'text-rose-400/70'
                }`}>
                  {(bid.change ?? 0) >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {Math.abs(bid.change ?? 0).toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
          
          <div className="text-[11px] text-white/20 mt-4 pl-3">+7 more bidders</div>
        </div>

        {/* Info Note */}
        <div className="px-5 py-5 mx-5 mb-5 rounded-lg bg-amber-500/5 border border-amber-500/10">
          <div className="flex items-start gap-3">
            <Zap size={14} className="text-amber-400/70 mt-0.5 shrink-0" />
            <p className="text-[12px] text-white/50 leading-relaxed">
              This auction completes in <span className="text-amber-400/80 font-mono">&lt;100ms</span> before the page loads.
            </p>
          </div>
        </div>

        {/* View Profiles Button */}
        <div className="px-5 pb-6">
          <button
            onClick={() => setShowAdProfiles(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
          >
            <TrendingUp size={16} />
            View Your Ad Profiles
            <ChevronRight size={14} className="opacity-50" />
          </button>
        </div>

        {/* System Console */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Terminal size={12} className="text-white/30" />
            <span className="text-[10px] uppercase tracking-widest text-white/30">System Console</span>
          </div>
          <div className="h-[380px] rounded-lg overflow-hidden border border-white/5 bg-[#050508]">
            <LiveConsole />
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showAdProfiles && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAdProfiles(false)} />
            <motion.div
              className="relative w-full max-w-sm bg-[#0c0c12] rounded-xl border border-white/10 overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="text-white/90 font-medium">Ad Profiles</span>
                <button onClick={() => setShowAdProfiles(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="p-3 space-y-1">
                {adProfileLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors group"
                  >
                    <span className="text-sm">{link.name}</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-50" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
