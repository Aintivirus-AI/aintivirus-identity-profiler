import { useEffect, useRef } from 'react';
import { useProfileStore } from '../store/useProfileStore';

export function useEmotionTracker() {
  const { updateEmotions, updateMouse, addConsoleEntry } = useProfileStore();
  const exitIntentRef = useRef(0);
  const mousePositions = useRef<{ x: number; y: number }[]>([]);
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page
      if (e.clientY <= 0) {
        exitIntentRef.current++;
        updateEmotions({ exitIntents: exitIntentRef.current });
        addConsoleEntry('DATA', 'Exit intent detected (mouse left top of page)');
      }
    };

    // Mouse in/out window tracking
    const handleMouseEnter = () => {
      updateMouse({ inWindow: true });
    };

    // Handedness detection based on mouse movement patterns
    const handleMouseMove = (e: MouseEvent) => {
      mousePositions.current.push({ x: e.clientX, y: e.clientY });
      
      // Keep last 100 positions
      if (mousePositions.current.length > 100) {
        mousePositions.current = mousePositions.current.slice(-100);
      }

      // Calculate handedness after enough data
      if (mousePositions.current.length >= 50) {
        const positions = mousePositions.current;
        let leftMovements = 0;
        let rightMovements = 0;

        for (let i = 1; i < positions.length; i++) {
          const dx = positions[i].x - positions[i - 1].x;
          if (dx < -5) leftMovements++;
          if (dx > 5) rightMovements++;
        }

        // Right-handed users tend to have more right-to-left movements
        // (dragging back towards themselves)
        const total = leftMovements + rightMovements;
        if (total > 0) {
          const leftRatio = leftMovements / total;
          // If more leftward movements, likely right-handed
          if (leftRatio > 0.55) {
            updateEmotions({
              handedness: 'right',
              handednessConfidence: Math.round(leftRatio * 100),
            });
          } else if (leftRatio < 0.45) {
            updateEmotions({
              handedness: 'left',
              handednessConfidence: Math.round((1 - leftRatio) * 100),
            });
          }
        }

        if (!hasLoggedRef.current && mousePositions.current.length >= 100) {
          addConsoleEntry('SCAN', 'Emotion and handedness analysis active');
          hasLoggedRef.current = true;
        }
      }
    };

    // Calculate engagement score periodically
    const updateEngagement = () => {
      const state = useProfileStore.getState();
      const { mouse, typing, scroll, attention } = state.behavioral;
      
      let engagement = 0;
      
      // Mouse activity contributes to engagement
      if (mouse.movements > 0) engagement += Math.min(30, mouse.movements / 10);
      if (mouse.totalClicks > 0) engagement += Math.min(20, mouse.totalClicks * 5);
      
      // Scroll activity
      if (scroll.scrollEvents > 0) engagement += Math.min(20, scroll.scrollEvents * 2);
      
      // Typing activity
      if (typing.totalKeystrokes > 0) engagement += Math.min(20, typing.totalKeystrokes / 2);
      
      // Time on page (max 10 points for being here > 30 seconds)
      const timeOnPage = Date.now() - attention.sessionStart;
      if (timeOnPage > 30000) engagement += 10;

      updateEmotions({ engagement: Math.min(100, Math.round(engagement)) });
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousemove', handleMouseMove);
    
    const engagementInterval = setInterval(updateEngagement, 2000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(engagementInterval);
    };
  }, [updateEmotions, updateMouse, addConsoleEntry]);
}
