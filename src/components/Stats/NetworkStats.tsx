import { motion } from 'framer-motion';
import { Globe, Wifi, MapPin, Loader2 } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { GlassCard, CardHeader, StatRow } from '../ui/GlassCard';

export function NetworkStats() {
  const { network } = useProfileStore();

  if (network.loading) {
    return (
      <GlassCard>
        <CardHeader icon={<Globe size={16} />}>
          Network Trace
        </CardHeader>
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 size={32} className="text-cyber-cyan animate-spin mb-3" />
          <p className="text-cyber-text-dim text-sm">Tracing network origin...</p>
        </div>
      </GlassCard>
    );
  }

  if (network.error) {
    return (
      <GlassCard>
        <CardHeader icon={<Globe size={16} />}>
          Network Trace
        </CardHeader>
        <div className="text-cyber-red text-sm p-4 text-center">
          <p>Trace failed: {network.error}</p>
          <p className="text-cyber-text-dim mt-2">VPN or firewall may be blocking</p>
        </div>
      </GlassCard>
    );
  }

  const maskIp = (ip: string | null) => {
    if (!ip) return '---';
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***`;
    }
    return ip.substring(0, 10) + '***';
  };

  return (
    <GlassCard>
      <CardHeader icon={<Globe size={16} />}>
        Network Trace
      </CardHeader>

      <div className="space-y-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2 text-cyber-text-dim text-xs uppercase tracking-wide">
            <Wifi size={12} />
            IP Address
          </div>
          <div className="text-cyber-cyan font-mono text-lg mb-3">
            {maskIp(network.ip)}
          </div>
        </motion.div>

        <StatRow 
          label="City"
          value={network.city}
        />

        <StatRow 
          label="Region"
          value={network.region}
        />

        <StatRow 
          label="Country"
          value={network.country}
          valueColor="text-cyber-cyan"
        />

        <StatRow 
          label="ISP"
          value={network.isp ? (network.isp.length > 25 ? network.isp.substring(0, 25) + '...' : network.isp) : null}
        />

        <StatRow 
          label="Timezone"
          value={network.timezone}
        />

        <div className="border-t border-cyber-glass-border mt-3 pt-3">
          <div className="flex items-center gap-2 text-cyber-text-dim text-xs">
            <MapPin size={12} />
            <span>
              {network.latitude?.toFixed(4)}, {network.longitude?.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
