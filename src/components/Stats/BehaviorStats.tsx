import { motion } from 'framer-motion';
import { Keyboard, Mouse, Eye, Activity, AlertTriangle } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { GlassCard, CardHeader } from '../ui/GlassCard';

function MiniProgressBar({ 
  value, 
  max, 
  color = 'cyan' 
}: { 
  value: number; 
  max: number; 
  color?: 'cyan' | 'red' | 'green' | 'purple';
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorStyles = {
    cyan: 'bg-cyber-cyan',
    red: 'bg-cyber-red',
    green: 'bg-cyber-green',
    purple: 'bg-cyber-purple',
  };

  return (
    <div className="w-16 h-1.5 bg-cyber-glass rounded-full overflow-hidden">
      <motion.div 
        className={`h-full ${colorStyles[color]} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

export function BehaviorStats() {
  const { behavioral } = useProfileStore();
  const { typing, mouse, attention } = behavioral;

  const formatDistance = (distance: number) => {
    if (distance > 10000) {
      return `${(distance / 1000).toFixed(1)}k px`;
    }
    return `${Math.round(distance)} px`;
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <GlassCard>
      <CardHeader icon={<Activity size={16} />}>
        Behavioral Analysis
      </CardHeader>

      <div className="space-y-4">
        {/* Typing Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2 text-cyber-cyan text-xs uppercase tracking-wide">
            <Keyboard size={12} />
            Typing Dynamics
          </div>
          <div className="space-y-1 pl-4">
            <div className="flex justify-between items-center">
              <span className="text-cyber-text-dim text-sm">Keystrokes</span>
              <span className="font-mono text-cyber-text">{typing.totalKeystrokes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cyber-text-dim text-sm">Speed</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyber-cyan">{typing.averageWPM} WPM</span>
                <MiniProgressBar value={typing.averageWPM} max={120} color="cyan" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cyber-text-dim text-sm">Hold Time</span>
              <span className="font-mono text-cyber-text">{typing.averageHoldTime}ms</span>
            </div>
          </div>
        </motion.div>

        {/* Mouse Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2 text-cyber-purple text-xs uppercase tracking-wide">
            <Mouse size={12} />
            Mouse Patterns
          </div>
          <div className="space-y-1 pl-4">
            <div className="flex justify-between items-center">
              <span className="text-cyber-text-dim text-sm">Total Clicks</span>
              <span className="font-mono text-cyber-text">{mouse.totalClicks}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cyber-text-dim text-sm">Distance</span>
              <span className="font-mono text-cyber-text">{formatDistance(mouse.totalDistance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cyber-text-dim text-sm">Avg Velocity</span>
              <span className="font-mono text-cyber-text">{mouse.averageVelocity} px/s</span>
            </div>
            {mouse.rageClicks > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-cyber-red text-sm flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Rage Clicks
                </span>
                <span className="font-mono text-cyber-red">{mouse.rageClicks}</span>
              </div>
            )}
            {mouse.erraticMovements > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-cyber-yellow text-sm">Erratic</span>
                <span className="font-mono text-cyber-yellow">{mouse.erraticMovements}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Attention Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2 text-cyber-green text-xs uppercase tracking-wide">
            <Eye size={12} />
            Attention Metrics
          </div>
          <div className="space-y-1 pl-4">
            <div className="flex justify-between items-center">
              <span className="text-cyber-text-dim text-sm">Tab Switches</span>
              <div className="flex items-center gap-2">
                <span className={`font-mono ${attention.tabSwitches > 5 ? 'text-cyber-red' : 'text-cyber-text'}`}>
                  {attention.tabSwitches}
                </span>
                {attention.tabSwitches > 5 && (
                  <span className="text-cyber-red text-xs">(distracted)</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cyber-text-dim text-sm">Away Time</span>
              <span className="font-mono text-cyber-text">{formatTime(attention.totalHiddenTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cyber-text-dim text-sm">Status</span>
              <span className={`font-mono ${attention.isVisible ? 'text-cyber-green' : 'text-cyber-red'}`}>
                {attention.isVisible ? '● Active' : '○ Away'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
}
