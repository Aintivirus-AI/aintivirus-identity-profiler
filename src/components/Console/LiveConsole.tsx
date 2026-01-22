import { useEffect, useRef, memo } from 'react';
import { Terminal, Circle } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { formatTimestamp, getLevelColor } from '../../lib/consoleLogger';
import type { ConsoleEntry } from '../../lib/consoleLogger';

// Memoized console entry to prevent re-renders
const ConsoleEntryRow = memo(function ConsoleEntryRow({ entry }: { entry: ConsoleEntry }) {
  return (
    <div
      className="leading-relaxed py-1 hover:bg-white/[0.02] rounded px-2 -mx-2 group transition-colors"
    >
      <span className="text-cyber-text-dim/60 group-hover:text-cyber-text-dim transition-colors">
        {formatTimestamp(entry.timestamp)}
      </span>
      <span className={`ml-2 ${getLevelColor(entry.level)} font-semibold`}>
        [{entry.level}]
      </span>
      <span className="text-cyber-text/90 ml-2">
        {entry.message}
      </span>
    </div>
  );
});

export function LiveConsole() {
  const { consoleEntries } = useProfileStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleEntries.length]); // Only trigger on length change

  return (
    <div 
      className="h-full flex flex-col glass-card overflow-hidden"
    >
      {/* Terminal Header */}
      <div className="px-4 py-3 border-b border-cyber-glass-border/50 flex items-center justify-between bg-cyber-bg-light/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Circle size={10} className="text-cyber-red fill-cyber-red" />
            <Circle size={10} className="text-cyber-yellow fill-cyber-yellow" />
            <Circle size={10} className="text-cyber-green fill-cyber-green" />
          </div>
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-cyber-cyan" />
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.15em] text-cyber-cyan">
              Live System Feed
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
          <span className="text-cyber-text-dim text-[10px] font-mono">LIVE</span>
        </div>
      </div>
      
      {/* Console Output - removed AnimatePresence for performance */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[12px] space-y-0.5 bg-gradient-to-b from-cyber-bg/50 to-transparent"
        style={{ maxHeight: '400px' }}
      >
        {consoleEntries.map((entry) => (
          <ConsoleEntryRow key={entry.id} entry={entry} />
        ))}
        
        {consoleEntries.length === 0 && (
          <div className="text-cyber-text-dim/50 text-center py-8 font-sans">
            Waiting for system events...
          </div>
        )}

        {/* Blinking cursor - CSS animation instead of Framer Motion */}
        <div className="flex items-center gap-1.5 mt-3 px-2">
          <span className="text-cyber-cyan font-semibold">{'>'}</span>
          <span className="w-2 h-4 bg-cyber-cyan rounded-sm animate-blink" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-cyber-glass-border/30 bg-cyber-bg-light/20">
        <div className="flex items-center justify-between">
          <span className="text-cyber-text-dim/60 text-[10px] font-mono">
            {consoleEntries.length} entries
          </span>
          <span className="text-cyber-text-dim/40 text-[10px]">
            All data processed locally
          </span>
        </div>
      </div>
    </div>
  );
}
