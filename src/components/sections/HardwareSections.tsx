import { Monitor, Cpu, Wifi, HardDrive, Fingerprint, Globe, Smartphone, Box, Zap, Database, Shield } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { DataSection, DataRow, StatusRow, TagList } from '../ui/DataSection';

export function CrossBrowserTrackingSection() {
  const { hardware, network } = useProfileStore();

  return (
    <DataSection title="Why We Can Track You Across Browsers" icon={<Fingerprint size={14} />} iconColor="text-cyber-red">
      <DataRow label="Screen" value={`${hardware.screenWidth}x${hardware.screenHeight}`} />
      <DataRow label="Color Depth" value={`${hardware.colorDepth}-bit`} />
      <DataRow label="Pixel Ratio" value={`${hardware.pixelRatio}x`} />
      <DataRow label="CPU Cores" value={hardware.cpuCores} />
      <DataRow label="RAM" value={hardware.ram ? `${hardware.ram}GB` : null} />
      <DataRow label="Timezone" value={network.timezone} />
      <DataRow label="Language" value={navigator.language} />
      <DataRow label="Platform" value={navigator.platform} />
      <DataRow label="Touch Points" value={hardware.maxTouchPoints} />
      <DataRow label="Fonts" value={`~${useProfileStore.getState().fingerprints.fontsDetected}`} />
    </DataSection>
  );
}

export function BrowserInfoSection() {
  const { browser } = useProfileStore();

  return (
    <DataSection title="Browser" icon={<Globe size={14} />} iconColor="text-cyber-cyan">
      <DataRow
        label="User Agent"
        value={browser.userAgent.length > 50 ? browser.userAgent.substring(0, 50) + '...' : browser.userAgent}
      />
      <DataRow label="Languages" value={browser.languages.join(', ')} />
      <DataRow label="Referrer" value={browser.referrer || 'Direct'} />
      <DataRow label="Platform" value={browser.platform} />
      <DataRow label="Language" value={browser.language} />
      <DataRow label="Do Not Track" value={browser.doNotTrack === '1' ? 'Yes' : 'No'} />
      <DataRow
        label="Global Privacy Control"
        value={browser.globalPrivacyControl === null ? 'N/A' : browser.globalPrivacyControl ? 'Yes' : 'No'}
      />
      <StatusRow label="Cookies Enabled" detected={browser.cookiesEnabled} />
      <StatusRow label="LocalStorage" detected={browser.localStorage} />
      <StatusRow label="SessionStorage" detected={browser.sessionStorage} />
      <StatusRow label="IndexedDB" detected={browser.indexedDB} />
      <StatusRow label="PDF Viewer" detected={browser.pdfViewer} />
    </DataSection>
  );
}

export function ClientHintsSection() {
  const { browser } = useProfileStore();

  return (
    <DataSection title="Client Hints" icon={<Cpu size={14} />} iconColor="text-cyber-purple">
      <DataRow label="Architecture" value={browser.architecture || '—'} />
      <DataRow label="Bitness" value={browser.bitness ? `${browser.bitness}-bit` : '—'} />
      <DataRow label="Mobile" value={browser.mobile ? 'Yes' : 'No'} />
      <DataRow label="Model" value={browser.model || '—'} />
      <DataRow label="Platform Version" value={browser.platformVersion || '—'} />
      <DataRow
        label="Browser Versions"
        value={browser.browserVersions ? (browser.browserVersions.length > 40 ? browser.browserVersions.substring(0, 40) + '...' : browser.browserVersions) : '—'}
      />
    </DataSection>
  );
}

export function DisplaySection() {
  const { hardware } = useProfileStore();

  return (
    <DataSection title="Display" icon={<Monitor size={14} />} iconColor="text-cyber-cyan">
      <DataRow label="Screen" value={`${hardware.screenWidth} x ${hardware.screenHeight}`} />
      <DataRow label="Window" value={`${hardware.windowWidth} x ${hardware.windowHeight}`} />
      <DataRow label="Color Depth" value={`${hardware.colorDepth}-bit`} />
      <DataRow label="Pixel Ratio" value={`${hardware.pixelRatio}x`} />
      <DataRow label="Orientation" value={hardware.orientation} />
      <DataRow label="Touch Points" value={hardware.maxTouchPoints} />
    </DataSection>
  );
}

export function HardwareSection() {
  const { hardware } = useProfileStore();

  const formatGpu = (gpu: string | null) => {
    if (!gpu) return 'Unknown';
    if (gpu.length > 40) return gpu.substring(0, 40) + '...';
    return gpu;
  };

  return (
    <DataSection title="Hardware" icon={<Cpu size={14} />} iconColor="text-cyber-cyan">
      <DataRow label="CPU Cores" value={hardware.cpuCores} />
      <DataRow label="RAM" value={hardware.ram ? `${hardware.ram} GB (capped)` : null} />
      <DataRow label="GPU Vendor" value={hardware.gpuVendor || 'Unknown'} />
      <DataRow label="GPU" value={formatGpu(hardware.gpu)} />
      <DataRow label="WebGL Version" value={hardware.webglVersion} />
      <DataRow label="WebGL Extensions" value={hardware.webglExtensions} />
    </DataSection>
  );
}

export function NetworkSection() {
  const { network } = useProfileStore();

  return (
    <DataSection title="Network" icon={<Wifi size={14} />} iconColor="text-cyber-green">
      <DataRow label="Connection" value={network.connectionType?.toUpperCase() || 'Unknown'} />
      <DataRow label="Downlink" value={network.downlink ? `${network.downlink} Mbps` : null} />
      <DataRow label="RTT" value={network.rtt ? `${network.rtt} ms` : null} />
      <StatusRow label="Data Saver" detected={network.dataSaver} />
      <DataRow
        label="Battery"
        value={useProfileStore.getState().hardware.battery 
          ? `${Math.round(useProfileStore.getState().hardware.battery!.level * 100)}%`
          : '—'}
      />
      <StatusRow
        label="Charging"
        detected={useProfileStore.getState().hardware.battery?.charging || false}
      />
      <StatusRow label="WebRTC Supported" detected={network.webrtcSupported} />
    </DataSection>
  );
}

export function MediaDevicesSection() {
  const { mediaDevices } = useProfileStore();

  return (
    <DataSection title="Media Devices" icon={<Smartphone size={14} />} iconColor="text-cyber-purple">
      <DataRow label="Microphones" value={mediaDevices.microphones} />
      <DataRow label="Cameras" value={mediaDevices.cameras} />
      <DataRow label="Speakers" value={mediaDevices.speakers} />
    </DataSection>
  );
}

export function StorageSection() {
  const { storage } = useProfileStore();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <DataSection title="Storage" icon={<HardDrive size={14} />} iconColor="text-cyber-cyan">
      <DataRow label="Used" value={formatBytes(storage.used)} />
      <DataRow label="Quota" value={formatBytes(storage.quota)} />
      <DataRow label="Usage %" value={`${storage.usagePercent.toFixed(2)}%`} />
    </DataSection>
  );
}

export function PermissionsSection() {
  const { permissions } = useProfileStore();

  return (
    <DataSection title="Permissions" icon={<Shield size={14} />} iconColor="text-cyber-yellow">
      <DataRow label="geolocation" value={permissions.geolocation} />
      <DataRow label="notifications" value={permissions.notifications} />
      <DataRow label="camera" value={permissions.camera} />
      <DataRow label="microphone" value={permissions.microphone} />
      <DataRow label="accelerometer" value={permissions.accelerometer} />
      <DataRow label="gyroscope" value={permissions.gyroscope} />
      <DataRow label="magnetometer" value={permissions.magnetometer} />
      <DataRow label="clipboard-read" value={permissions.clipboardRead} />
      <DataRow label="clipboard-write" value={permissions.clipboardWrite} />
    </DataSection>
  );
}

export function APISupportSection() {
  const { apiSupport } = useProfileStore();

  return (
    <DataSection title="API Support" icon={<Box size={14} />} iconColor="text-cyber-green">
      <StatusRow label="Bluetooth" detected={apiSupport.bluetooth} />
      <StatusRow label="USB" detected={apiSupport.usb} />
      <StatusRow label="MIDI" detected={apiSupport.midi} />
      <StatusRow label="Gamepads" detected={apiSupport.gamepads} />
      <StatusRow label="WebGPU" detected={apiSupport.webgpu} />
      <StatusRow label="SharedArrayBuffer" detected={apiSupport.sharedArrayBuffer} />
    </DataSection>
  );
}

export function FingerprintsSection() {
  const { fingerprints, network } = useProfileStore();

  return (
    <DataSection title="Fingerprints" icon={<Fingerprint size={14} />} iconColor="text-cyber-red">
      <DataRow label="Canvas Hash" value={fingerprints.canvasHash} />
      <DataRow label="Audio Hash" value={fingerprints.audioHash} />
      <DataRow label="WebGL Hash" value={fingerprints.webglHash} />
      <DataRow label="Fonts Detected" value={fingerprints.fontsDetected} />
      <DataRow label="Speech Voices" value={fingerprints.speechVoices} />
      <DataRow label="Voices Hash" value={fingerprints.voicesHash} />
      <DataRow label="Timezone" value={network.timezone} />
      <DataRow
        label="TZ Offset"
        value={`UTC${new Date().getTimezoneOffset() <= 0 ? '+' : ''}${-new Date().getTimezoneOffset() / 60}`}
      />
    </DataSection>
  );
}

export function SystemPreferencesSection() {
  const { systemPreferences } = useProfileStore();

  return (
    <DataSection title="System Preferences" icon={<Zap size={14} />} iconColor="text-cyber-purple">
      <DataRow label="Color Scheme" value={systemPreferences.colorScheme} />
      <StatusRow label="Reduced Motion" detected={systemPreferences.reducedMotion} notDetectedText="No" />
      <StatusRow label="Reduced Transparency" detected={systemPreferences.reducedTransparency} notDetectedText="No" />
      <DataRow label="Contrast" value={systemPreferences.contrast} />
      <StatusRow label="Forced Colors" detected={systemPreferences.forcedColors} notDetectedText="No" />
      <DataRow label="Color Gamut" value={systemPreferences.colorGamut} />
      <StatusRow label="HDR Support" detected={systemPreferences.hdrSupport} notDetectedText="No" />
      <StatusRow label="Inverted Colors" detected={systemPreferences.invertedColors} notDetectedText="No" />
    </DataSection>
  );
}

export function MediaCodecsSection() {
  const { mediaCodecs } = useProfileStore();

  return (
    <DataSection title="Media Codecs" icon={<Database size={14} />} iconColor="text-cyber-cyan">
      <div className="py-1.5 border-b border-cyber-glass-border/50">
        <span className="text-cyber-text-dim text-xs block mb-1.5">Video Codecs</span>
        <TagList tags={mediaCodecs.videoCodecs} color="cyan" />
      </div>
      <div className="py-1.5 border-b border-cyber-glass-border/50">
        <span className="text-cyber-text-dim text-xs block mb-1.5">Audio Codecs</span>
        <TagList tags={mediaCodecs.audioCodecs} color="purple" />
      </div>
      <StatusRow label="Widevine DRM" detected={mediaCodecs.widevineDRM} />
      <StatusRow label="FairPlay DRM" detected={mediaCodecs.fairPlayDRM} />
      <StatusRow label="PlayReady DRM" detected={mediaCodecs.playReadyDRM} />
    </DataSection>
  );
}

export function SensorsSection() {
  const { sensors } = useProfileStore();

  return (
    <DataSection title="Sensors" icon={<Cpu size={14} />} iconColor="text-cyber-green">
      <StatusRow label="Accelerometer" detected={sensors.accelerometer} />
      <StatusRow label="Gyroscope" detected={sensors.gyroscope} />
      <StatusRow label="Magnetometer" detected={sensors.magnetometer} />
      <StatusRow label="Ambient Light" detected={sensors.ambientLight} />
      <StatusRow label="Proximity" detected={sensors.proximity} />
      <StatusRow label="Linear Acceleration" detected={sensors.linearAcceleration} />
      <StatusRow label="Gravity" detected={sensors.gravity} />
      <StatusRow label="Orientation" detected={sensors.orientation} />
    </DataSection>
  );
}

export function JSMemorySection() {
  const { jsMemory } = useProfileStore();

  const formatMemory = (bytes: number | null) => {
    if (bytes === null) return 'N/A';
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatMemoryMB = (bytes: number | null) => {
    if (bytes === null) return 'N/A';
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <DataSection title="JS Memory" icon={<Database size={14} />} iconColor="text-cyber-yellow">
      <DataRow label="Heap Limit" value={formatMemory(jsMemory.heapLimit)} />
      <DataRow label="Total Heap" value={formatMemoryMB(jsMemory.totalHeap)} />
      <DataRow label="Used Heap" value={formatMemoryMB(jsMemory.usedHeap)} />
    </DataSection>
  );
}

export function WebAPISection() {
  const { apiSupport } = useProfileStore();

  return (
    <DataSection title="Web APIs" icon={<Globe size={14} />} iconColor="text-cyber-cyan">
      <StatusRow label="Service Worker" detected={apiSupport.serviceWorker} />
      <StatusRow label="Web Worker" detected={apiSupport.webWorker} />
      <StatusRow label="WebAssembly" detected={apiSupport.webAssembly} />
      <StatusRow label="WebSocket" detected={apiSupport.webSocket} />
      <StatusRow label="WebRTC" detected={apiSupport.webRTC} />
      <StatusRow label="Notifications" detected={apiSupport.notifications} />
      <StatusRow label="Push API" detected={apiSupport.pushAPI} />
      <StatusRow label="Payment Request" detected={apiSupport.paymentRequest} />
      <StatusRow label="Credentials API" detected={apiSupport.credentialsAPI} />
      <StatusRow label="Clipboard API" detected={apiSupport.clipboardAPI} />
    </DataSection>
  );
}

export function AdvancedFingerprintsSection() {
  const { fingerprints } = useProfileStore();

  return (
    <DataSection title="Advanced Fingerprints" icon={<Fingerprint size={14} />} iconColor="text-cyber-purple">
      <DataRow label="Math Hash" value={fingerprints.mathHash} />
      <DataRow label="Timing Hash" value={fingerprints.timingHash} />
      <DataRow label="Error Hash" value={fingerprints.errorHash} />
      <DataRow label="Navigator Props" value={fingerprints.navigatorProps} />
      <DataRow label="Window Props" value={fingerprints.windowProps} />
      <DataRow label="Max Downlink" value="N/A" />
    </DataSection>
  );
}

export function WasmFingerprintSection() {
  const { fingerprints, aiAnalysis } = useProfileStore();

  return (
    <DataSection title="WebAssembly Fingerprint" icon={<Box size={14} />} iconColor="text-cyber-green">
      <StatusRow label="WASM Support" detected={fingerprints.wasmSupported} detectedText="Supported" notDetectedText="Not supported" />
      <div className="py-1.5 border-b border-cyber-glass-border/50">
        <span className="text-cyber-text-dim text-xs block mb-1.5">Features</span>
        <TagList tags={fingerprints.wasmFeatures} color="green" />
      </div>
      <DataRow label="Max Memory" value={fingerprints.wasmMaxMemory ? `${fingerprints.wasmMaxMemory} MB` : '—'} />
      <DataRow label="WASM Hash" value={fingerprints.wasmHash} />
      <DataRow label="Confidence" value={`${aiAnalysis.humanScore}%`} />
    </DataSection>
  );
}

export function WebGPUFingerprintSection() {
  const { fingerprints } = useProfileStore();

  return (
    <DataSection title="WebGPU Fingerprint" icon={<Cpu size={14} />} iconColor="text-cyber-purple">
      <StatusRow
        label="WebGPU"
        detected={fingerprints.webgpuAvailable}
        detectedText="Available"
        notDetectedText="Not available"
      />
      <DataRow label="GPU Vendor" value={fingerprints.webgpuVendor || '—'} />
      <DataRow label="Architecture" value={fingerprints.webgpuArchitecture || '—'} />
      <DataRow label="Device" value={fingerprints.webgpuDevice || 'unknown'} />
      <StatusRow label="Fallback Adapter" detected={fingerprints.webgpuFallbackAdapter} notDetectedText="No" />
      <DataRow label="Feature Count" value={fingerprints.webgpuFeatureCount} />
      {fingerprints.webgpuKeyFeatures.length > 0 && (
        <div className="py-1.5 border-b border-cyber-glass-border/50">
          <span className="text-cyber-text-dim text-xs block mb-1.5">Key Features</span>
          <p className="text-cyber-text font-mono text-[10px] break-all">
            {fingerprints.webgpuKeyFeatures.slice(0, 5).join(', ')}...
          </p>
        </div>
      )}
      <DataRow label="Canvas Format" value={fingerprints.webgpuCanvasFormat || '—'} />
      <DataRow label="Compute Timing" value={fingerprints.webgpuComputeTiming ? `${fingerprints.webgpuComputeTiming.toFixed(2)} ms` : '—'} />
      <DataRow label="Timing Pattern" value={fingerprints.webgpuTimingPattern || '—'} />
      <DataRow label="WebGPU Hash" value={fingerprints.webgpuHash || '—'} />
    </DataSection>
  );
}

export function ChromeAISection() {
  const { chromeAI } = useProfileStore();

  return (
    <DataSection title="Chrome Built-in AI" icon={<Zap size={14} />} iconColor="text-cyber-yellow">
      <StatusRow
        label="Chrome AI"
        detected={chromeAI.supported}
        detectedText="Supported"
        notDetectedText="Not Supported"
      />
      <DataRow label="Browser" value={chromeAI.browserVersion} />
      <StatusRow label="Min Version Met" detected={chromeAI.minVersionMet} />
      <DataRow label="APIs" value={chromeAI.apis.length > 0 ? chromeAI.apis.join(', ') : 'None detected'} />
    </DataSection>
  );
}
