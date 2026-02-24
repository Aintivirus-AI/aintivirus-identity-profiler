import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, ChevronDown } from 'lucide-react';
import type { ChatMessage } from '../../hooks/useVisitors';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isConnected: boolean;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatBox({ messages, onSend, isConnected }: ChatBoxProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="absolute bottom-[70px] md:bottom-[80px] right-2 md:right-4 z-20 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[280px] md:w-[340px] bg-cyber-bg/95 backdrop-blur-xl border border-cyber-cyan/10 overflow-hidden shadow-2xl shadow-black/50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <MessageSquare size={14} className="text-cyber-cyan" />
                <span className="text-[11px] font-display font-semibold uppercase tracking-widest text-white/50">
                  Live Chat
                </span>
                <span className="text-[9px] font-mono text-white/20">
                  {messages.length > 0 ? `${messages.length} msg` : ''}
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white/60 transition-colors p-1"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 max-h-[240px] min-h-[140px] overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <MessageSquare size={20} className="text-white/10" />
                  <p className="text-white/20 text-[11px] text-center font-mono">
                    No messages yet
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={`${msg.timestamp}-${i}`} className="flex flex-col gap-0.5">
                  <p className="text-white/80 text-[12px] leading-relaxed break-words">
                    {msg.text}
                  </p>
                  <span className="text-white/15 text-[9px] font-mono">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-white/5 flex items-center gap-2 px-4 py-3 bg-white/[0.02]">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isConnected ? 'Say something...' : 'Disconnected'}
                disabled={!isConnected}
                maxLength={500}
                className="flex-1 bg-transparent text-white/80 text-[12px] placeholder:text-white/20 outline-none disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!isConnected || !input.trim()}
                className="text-cyber-cyan/60 hover:text-cyber-cyan transition-colors disabled:opacity-20 disabled:cursor-not-allowed p-1"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 bg-cyber-bg/80 backdrop-blur-xl px-6 py-4 rounded-full border border-cyber-cyan/15 text-white/50 hover:text-cyber-cyan hover:border-cyber-cyan/40 hover:bg-cyber-bg/90 transition-all cursor-pointer shadow-lg shadow-cyan-900/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare size={16} />
          <span className="text-[11px] font-display font-semibold uppercase tracking-widest">
            Chat
          </span>
          {messages.length > 0 && (
            <span className="bg-cyber-cyan/20 text-cyber-cyan text-[10px] font-mono px-2 py-0.5 rounded-full min-w-[24px] text-center">
              {messages.length}
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
}
