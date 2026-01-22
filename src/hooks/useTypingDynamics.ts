import { useEffect, useRef } from 'react';
import { useProfileStore } from '../store/useProfileStore';

interface KeyEvent {
  key: string;
  downTime: number;
  upTime?: number;
}

export function useTypingDynamics() {
  const { updateTyping, addConsoleEntry } = useProfileStore();
  const keyEventsRef = useRef<KeyEvent[]>([]);
  const holdTimesRef = useRef<number[]>([]);
  const interKeysRef = useRef<number[]>([]);
  const lastKeyUpRef = useRef<number | null>(null);
  const keystrokeCountRef = useRef(0);
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys and special keys
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;

      const now = Date.now();
      keystrokeCountRef.current++;

      // Track inter-key interval
      if (lastKeyUpRef.current !== null) {
        const interval = now - lastKeyUpRef.current;
        if (interval > 0 && interval < 2000) {
          interKeysRef.current.push(interval);
        }
      }

      keyEventsRef.current.push({
        key: e.key,
        downTime: now,
      });

      updateTyping({
        totalKeystrokes: keystrokeCountRef.current,
        lastKeystrokeTime: now,
      });

      if (!hasLoggedRef.current) {
        addConsoleEntry('SCAN', 'Keystroke pattern analysis initiated');
        hasLoggedRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.length > 1) return;

      const now = Date.now();
      lastKeyUpRef.current = now;

      // Find the matching keydown event
      const keyEvent = keyEventsRef.current.find(
        (ke) => ke.key === e.key && !ke.upTime
      );

      if (keyEvent) {
        keyEvent.upTime = now;
        const holdTime = now - keyEvent.downTime;
        if (holdTime > 0 && holdTime < 1000) {
          holdTimesRef.current.push(holdTime);
        }
      }

      // Calculate metrics
      const avgHoldTime =
        holdTimesRef.current.length > 0
          ? holdTimesRef.current.reduce((a, b) => a + b, 0) / holdTimesRef.current.length
          : 0;

      // Calculate WPM based on inter-key intervals
      // Average word = 5 characters, so WPM = (characters / 5) / minutes
      const avgInterval =
        interKeysRef.current.length > 0
          ? interKeysRef.current.reduce((a, b) => a + b, 0) / interKeysRef.current.length
          : 0;
      
      // WPM = 60000 / (avgInterval * 5) where 5 is average characters per word
      const wpm = avgInterval > 0 ? Math.round(60000 / (avgInterval * 5)) : 0;

      updateTyping({
        averageWPM: Math.min(wpm, 200), // Cap at 200 WPM for sanity
        averageHoldTime: Math.round(avgHoldTime),
        keyInterval: avgInterval > 0 ? Math.round(avgInterval) : null,
      });

      // Clean up old events (keep last 100)
      if (keyEventsRef.current.length > 100) {
        keyEventsRef.current = keyEventsRef.current.slice(-50);
      }
      if (holdTimesRef.current.length > 100) {
        holdTimesRef.current = holdTimesRef.current.slice(-50);
      }
      if (interKeysRef.current.length > 100) {
        interKeysRef.current = interKeysRef.current.slice(-50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [updateTyping, addConsoleEntry]);
}
