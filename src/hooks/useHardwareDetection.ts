import { useEffect } from 'react';
import { useProfileStore } from '../store/useProfileStore';

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
    deviceMemory?: number;
  }
}

export function useHardwareDetection() {
  const { setHardware, addConsoleEntry } = useProfileStore();

  useEffect(() => {
    const detectHardware = async () => {
      addConsoleEntry('SCAN', 'Initiating hardware fingerprint scan...');

      // Detect GPU via WebGL
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl && gl instanceof WebGLRenderingContext) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            setHardware({ gpu: renderer, gpuVendor: vendor });
            addConsoleEntry('DATA', `GPU Detected: ${renderer}`);
          } else {
            const renderer = gl.getParameter(gl.RENDERER);
            setHardware({ gpu: renderer });
            addConsoleEntry('DATA', `GPU (masked): ${renderer}`);
          }
        }
      } catch (e) {
        addConsoleEntry('ALERT', 'WebGL detection failed');
      }

      // Detect CPU cores
      if (navigator.hardwareConcurrency) {
        setHardware({ cpuCores: navigator.hardwareConcurrency });
        addConsoleEntry('DATA', `CPU Cores: ${navigator.hardwareConcurrency}`);
      }

      // Detect RAM (Chrome only)
      if (navigator.deviceMemory) {
        setHardware({ ram: navigator.deviceMemory });
        addConsoleEntry('DATA', `Device Memory: ${navigator.deviceMemory}GB`);
      } else {
        addConsoleEntry('INFO', 'RAM detection not supported in this browser');
      }

      // Detect Battery
      if (navigator.getBattery) {
        try {
          const battery = await navigator.getBattery();
          setHardware({
            battery: {
              level: battery.level,
              charging: battery.charging,
            },
          });
          addConsoleEntry('DATA', `Battery: ${Math.round(battery.level * 100)}% ${battery.charging ? '(charging)' : ''}`);

          // Listen for battery changes
          battery.addEventListener('levelchange', () => {
            setHardware({
              battery: {
                level: battery.level,
                charging: battery.charging,
              },
            });
          });
          battery.addEventListener('chargingchange', () => {
            setHardware({
              battery: {
                level: battery.level,
                charging: battery.charging,
              },
            });
            addConsoleEntry('SYSTEM', `Charging status changed: ${battery.charging ? 'Plugged in' : 'Unplugged'}`);
          });
        } catch (e) {
          addConsoleEntry('INFO', 'Battery API not available');
        }
      }

      // Screen info
      setHardware({
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        pixelRatio: window.devicePixelRatio,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      });
      addConsoleEntry('DATA', `Display: ${window.screen.width}x${window.screen.height} @${window.devicePixelRatio}x`);

      addConsoleEntry('SYSTEM', 'Hardware scan complete');
    };

    detectHardware();
  }, [setHardware, addConsoleEntry]);
}
