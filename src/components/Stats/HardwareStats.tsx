import { motion } from 'framer-motion';
import { Monitor, Fingerprint } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { GlassCard, CardHeader, StatRow } from '../ui/GlassCard';
import { getBrowserInfo, getOSInfo } from '../../lib/profiler';

export function HardwareStats() {
  const { hardware } = useProfileStore();
  const browser = getBrowserInfo();
  const os = getOSInfo();

  const formatGpu = (gpu: string | null) => {
    if (!gpu) return '---';
    // Truncate long GPU names
    if (gpu.length > 35) {
      return gpu.substring(0, 35) + '...';
    }
    return gpu;
  };

  const formatBattery = () => {
    if (!hardware.battery) return '---';
    const percentage = Math.round(hardware.battery.level * 100);
    const status = hardware.battery.charging ? '⚡' : '';
    return `${percentage}% ${status}`;
  };

  return (
    <GlassCard>
      <CardHeader icon={<Fingerprint size={16} />}>
        Hardware Fingerprint
      </CardHeader>

      <div className="space-y-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2 text-cyber-text-dim text-xs uppercase tracking-wide">
            <Monitor size={12} />
            GPU
          </div>
          <div className="text-cyber-text font-mono text-sm mb-3 break-words">
            {formatGpu(hardware.gpu)}
          </div>
        </motion.div>

        <StatRow 
          label="CPU Cores"
          value={hardware.cpuCores}
          valueColor="text-cyber-cyan"
        />

        <StatRow 
          label="RAM"
          value={hardware.ram ? `${hardware.ram} GB` : null}
          valueColor="text-cyber-cyan"
        />

        <StatRow 
          label="Battery"
          value={formatBattery()}
          valueColor={
            hardware.battery && hardware.battery.level < 0.2 
              ? 'text-cyber-red' 
              : 'text-cyber-green'
          }
        />

        <StatRow 
          label="Display"
          value={`${hardware.screenWidth}x${hardware.screenHeight}`}
        />

        <StatRow 
          label="Pixel Ratio"
          value={`${hardware.pixelRatio}x`}
        />

        <StatRow 
          label="Touch"
          value={hardware.touchSupport ? 'Yes' : 'No'}
          valueColor={hardware.touchSupport ? 'text-cyber-green' : 'text-cyber-text-dim'}
        />

        <div className="border-t border-cyber-glass-border mt-3 pt-3">
          <StatRow 
            label="Browser"
            value={`${browser.name} ${browser.version}`}
          />
          <StatRow 
            label="OS"
            value={os}
          />
        </div>
      </div>
    </GlassCard>
  );
}
