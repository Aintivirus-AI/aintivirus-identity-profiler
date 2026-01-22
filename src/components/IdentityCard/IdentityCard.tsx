import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Cpu, Globe, Activity, Shield } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { generatePersona } from '../../lib/profiler';

function ScanningOverlay() {
  return (
    <motion.div 
      className="absolute inset-0 bg-[#07070c]/95 backdrop-blur-md flex flex-col items-center justify-center z-20"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative w-24 h-24 mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Fingerprint size={96} className="text-cyan-400/80" strokeWidth={1} />
        <motion.div 
          className="absolute inset-0 border border-cyan-400/50 rounded-full"
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </motion.div>
      <div className="text-cyan-400/60 text-xs uppercase tracking-[0.3em] font-mono">Analyzing</div>
      <div className="w-48 h-0.5 bg-white/5 rounded-full mt-4 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

export function IdentityCard() {
  const { hardware, network, behavioral, persona, setPersona, isScanning, setScanning, addConsoleEntry, aiProfileSummary, aiConfidence } = useProfileStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!network.loading && hardware.gpu) {
        const newPersona = generatePersona(hardware, network, behavioral);
        setPersona(newPersona);
        addConsoleEntry('SYSTEM', 'Identity profile generated');
        setTimeout(() => {
          setScanning(false);
          setShowContent(true);
        }, 400);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [network.loading, hardware.gpu, hardware, network, behavioral, setPersona, setScanning, addConsoleEntry]);

  useEffect(() => {
    if (!isScanning && behavioral.typing.totalKeystrokes > 0) {
      const newPersona = generatePersona(hardware, network, behavioral);
      setPersona(newPersona);
    }
  }, [behavioral.typing.totalKeystrokes, behavioral.mouse.totalClicks, behavioral.attention.tabSwitches]);

  const stats = persona ? [
    { icon: Cpu, label: 'Tech', value: persona.techLevel },
    { icon: Activity, label: 'State', value: persona.currentState },
    { icon: Globe, label: 'Type', value: persona.behavioralProfile },
    { icon: Shield, label: 'Confidence', value: '87%' },
  ] : [];

  return (
    <div className="h-full flex flex-col bg-[#07070c] relative overflow-hidden">
      <AnimatePresence>
        {isScanning && <ScanningOverlay />}
      </AnimatePresence>

      {/* Accent Line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-8 text-center border-b border-white/5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <Fingerprint size={12} className="text-cyan-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/80 font-medium">Identity Profile</span>
          </div>
          <p className="text-white/40 text-xs">We think you are...</p>
        </div>

        {showContent && persona && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="px-6 py-6"
          >
            {/* Main Persona */}
            <motion.div 
              className="text-center mb-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-violet-400 leading-tight">
                "{persona.vibeCheck}"
              </h2>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon size={12} className="text-white/30" />
                    <span className="text-[10px] uppercase tracking-wider text-white/30">{stat.label}</span>
                  </div>
                  <div className="text-white/90 text-sm font-medium truncate">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Description - use AI summary when available */}
            <motion.div 
              className="p-5 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {aiProfileSummary ? (
                <>
                  <p className="text-white/70 text-[13px] leading-relaxed mb-3">
                    {aiProfileSummary}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-white/30 text-[10px]">
                      Data-Driven Heuristic Analysis
                    </span>
                    {aiConfidence > 0 && (
                      <span className="text-cyan-400/60 text-[10px] font-mono">
                        {aiConfidence}% confident
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-white/60 text-[13px] leading-relaxed">
                  {persona.description}
                </p>
              )}
            </motion.div>

            {/* Live Indicator */}
            <motion.div 
              className="flex items-center justify-center gap-2 mt-6 text-white/30 text-[11px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Updates in real-time</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
