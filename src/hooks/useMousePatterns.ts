import { useEffect, useRef } from 'react';
import { useProfileStore } from '../store/useProfileStore';

interface ClickEvent {
  x: number;
  y: number;
  time: number;
}

interface MousePosition {
  x: number;
  y: number;
  time: number;
}

// Throttle function to limit update frequency
function throttle<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let lastCall = 0;
  return ((...args: unknown[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}

export function useMousePatterns() {
  const { updateMouse, updateEmotions, addConsoleEntry } = useProfileStore();
  const clicksRef = useRef<ClickEvent[]>([]);
  const positionsRef = useRef<MousePosition[]>([]);
  const totalClicksRef = useRef(0);
  const rageClicksRef = useRef(0);
  const erraticCountRef = useRef(0);
  const totalDistanceRef = useRef(0);
  const movementsRef = useRef(0);
  const velocitiesRef = useRef<number[]>([]);
  const accelerationsRef = useRef<number[]>([]);
  const lastClickTimeRef = useRef<number | null>(null);
  const lastActivityRef = useRef(Date.now());
  const hasLoggedRef = useRef(false);
  const pendingUpdateRef = useRef<Partial<Parameters<typeof updateMouse>[0]>>({});

  useEffect(() => {
    const RAGE_CLICK_THRESHOLD = 3;
    const RAGE_CLICK_RADIUS = 100;
    const RAGE_CLICK_TIME = 500;
    const ERRATIC_VELOCITY_THRESHOLD = 3000;
    const ERRATIC_ACCELERATION_THRESHOLD = 5000;

    const handleClick = (e: MouseEvent) => {
      const now = Date.now();
      totalClicksRef.current++;
      lastActivityRef.current = now;

      // Calculate click interval
      let clickInterval: number | null = null;
      if (lastClickTimeRef.current) {
        clickInterval = now - lastClickTimeRef.current;
      }
      lastClickTimeRef.current = now;

      const click: ClickEvent = { x: e.clientX, y: e.clientY, time: now };
      clicksRef.current.push(click);

      // Check for rage clicks
      const recentClicks = clicksRef.current.filter(
        (c) => now - c.time < RAGE_CLICK_TIME
      );

      if (recentClicks.length >= RAGE_CLICK_THRESHOLD) {
        const firstClick = recentClicks[0];
        const allClustered = recentClicks.every((c) => {
          const distance = Math.sqrt(
            Math.pow(c.x - firstClick.x, 2) + Math.pow(c.y - firstClick.y, 2)
          );
          return distance < RAGE_CLICK_RADIUS;
        });

        if (allClustered) {
          rageClicksRef.current++;
          updateEmotions({ rageClicks: rageClicksRef.current });
          addConsoleEntry('ALERT', `Rage click detected at (${e.clientX}, ${e.clientY})`);
        }
      }

      if (clicksRef.current.length > 50) {
        clicksRef.current = clicksRef.current.slice(-20);
      }

      updateMouse({
        totalClicks: totalClicksRef.current,
        rageClicks: rageClicksRef.current,
        clickInterval,
      });

      if (!hasLoggedRef.current) {
        addConsoleEntry('SCAN', 'Mouse behavior analysis active');
        hasLoggedRef.current = true;
      }
    };

    // Throttled store update - only updates every 200ms
    const flushMouseUpdate = throttle(() => {
      if (Object.keys(pendingUpdateRef.current).length > 0) {
        updateMouse(pendingUpdateRef.current);
        pendingUpdateRef.current = {};
      }
    }, 200);

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const current: MousePosition = { x: e.clientX, y: e.clientY, time: now };
      movementsRef.current++;
      lastActivityRef.current = now;

      if (positionsRef.current.length > 0) {
        const last = positionsRef.current[positionsRef.current.length - 1];
        const dt = (now - last.time) / 1000;

        if (dt > 0) {
          const dx = current.x - last.x;
          const dy = current.y - last.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const velocity = distance / dt;

          totalDistanceRef.current += distance;
          velocitiesRef.current.push(velocity);

          // Calculate acceleration
          if (velocitiesRef.current.length >= 2) {
            const prevVelocity = velocitiesRef.current[velocitiesRef.current.length - 2];
            const acceleration = Math.abs(velocity - prevVelocity) / dt;
            accelerationsRef.current.push(acceleration);

            if (velocity > ERRATIC_VELOCITY_THRESHOLD || acceleration > ERRATIC_ACCELERATION_THRESHOLD) {
              erraticCountRef.current++;
              if (erraticCountRef.current % 5 === 1) {
                addConsoleEntry('ALERT', 'Erratic mouse movement pattern detected');
              }
            }
          }

          const avgVelocity =
            velocitiesRef.current.length > 0
              ? velocitiesRef.current.reduce((a, b) => a + b, 0) / velocitiesRef.current.length
              : 0;

          const avgAcceleration =
            accelerationsRef.current.length > 0
              ? accelerationsRef.current.reduce((a, b) => a + b, 0) / accelerationsRef.current.length
              : 0;

          // Queue update instead of immediate store update
          pendingUpdateRef.current = {
            ...pendingUpdateRef.current,
            averageVelocity: Math.round(avgVelocity),
            totalDistance: Math.round(totalDistanceRef.current),
            erraticMovements: erraticCountRef.current,
            movements: movementsRef.current,
            acceleration: Math.round(avgAcceleration),
          };
          flushMouseUpdate();
        }
      }

      positionsRef.current.push(current);

      if (positionsRef.current.length > 100) {
        positionsRef.current = positionsRef.current.slice(-50);
      }
      if (velocitiesRef.current.length > 100) {
        velocitiesRef.current = velocitiesRef.current.slice(-50);
      }
      if (accelerationsRef.current.length > 100) {
        accelerationsRef.current = accelerationsRef.current.slice(-50);
      }
    };

    // Track idle time
    const idleInterval = setInterval(() => {
      const idleTime = Date.now() - lastActivityRef.current;
      updateMouse({ idleTime });
    }, 1000);

    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(idleInterval);
    };
  }, [updateMouse, updateEmotions, addConsoleEntry]);
}
