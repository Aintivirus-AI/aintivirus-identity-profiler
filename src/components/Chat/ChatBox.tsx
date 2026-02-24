import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X } from 'lucide-react';
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
            className="w-[260px] md:w-[300px] bg-cyber-bg/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageSquare size={12} className="text-cyber-cyan" />
                <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-white/50">
                  Anonymous Chat
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 max-h-[200px] min-h-[120px] overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.length === 0 && (
                <p className="text-white/20 text-[10px] text-center py-4 font-mono">
                  No messages yet. Say something.
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={`${msg.timestamp}-${i}`} className="group">
                  <p className="text-white/70 text-[11px] leading-relaxed break-words">
                    {msg.text}
                  </p>
                  <span className="text-white/20 text-[9px] font-mono">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-white/5 flex items-center gap-2 px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isConnected ? 'Type a message...' : 'Disconnected'}
                disabled={!isConnected}
                maxLength={500}
                className="flex-1 bg-transparent text-white/80 text-[11px] placeholder:text-white/20 outline-none disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!isConnected || !input.trim()}
                className="text-cyber-cyan/60 hover:text-cyber-cyan transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-cyber-bg/70 backdrop-blur-xl px-3 py-2 rounded-full border border-white/10 text-white/40 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-colors cursor-pointer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare size={12} />
          <span className="text-[9px] font-display font-semibold uppercase tracking-widest">
            Chat
          </span>
          {messages.length > 0 && (
            <span className="bg-cyber-cyan/20 text-cyber-cyan text-[8px] font-mono px-1.5 py-0.5 rounded-full">
              {messages.length}
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
}
