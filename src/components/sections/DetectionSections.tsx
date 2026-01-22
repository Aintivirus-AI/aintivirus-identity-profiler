import { AlertTriangle, Shield, Eye, Wallet, Globe, User } from 'lucide-react';
import { useProfileStore } from '../../store/useProfileStore';
import { DataSection, StatusRow, DataRow } from '../ui/DataSection';

export function BotDetectionSection() {
  const { botDetection, behavioral } = useProfileStore();
  const zeroMetrics = behavioral.mouse.averageVelocity === 0 && 
                     behavioral.typing.totalKeystrokes === 0 && 
                     behavioral.scroll.scrollEvents === 0;

  return (
    <DataSection title="Bot Detection Flags" icon={<AlertTriangle size={14} />} iconColor="text-cyber-red">
      <StatusRow
        label="isAutomated: true"
        detected={botDetection.isAutomated}
        alertOnDetect
      />
      <StatusRow
        label="isHeadless: true"
        detected={botDetection.isHeadless}
        alertOnDetect
      />
      <StatusRow
        label="behavior metrics all zero"
        detected={zeroMetrics}
        alertOnDetect
      />
    </DataSection>
  );
}

export function FraudRiskSection() {
  const { botDetection } = useProfileStore();

  return (
    <DataSection title="Fraud Risk Factors" icon={<AlertTriangle size={14} />} iconColor="text-cyber-red">
      <StatusRow
        label="isAutomated: true"
        detected={botDetection.isAutomated}
        detectedText="Flagged"
        notDetectedText="OK"
        alertOnDetect
      />
      <StatusRow
        label="isHeadless: true"
        detected={botDetection.isHeadless}
        detectedText="Flagged"
        notDetectedText="OK"
        alertOnDetect
      />
      <StatusRow
        label="zero behavioral metrics"
        detected={botDetection.zeroMetrics}
        detectedText="Flagged"
        notDetectedText="OK"
        alertOnDetect
      />
    </DataSection>
  );
}

export function TrackingDetectionSection() {
  const { trackingDetection } = useProfileStore();

  return (
    <DataSection title="Tracking Detection" icon={<Shield size={14} />} iconColor="text-cyber-cyan">
      <StatusRow
        label="Ad Blocker"
        detected={trackingDetection.adBlocker}
      />
      <StatusRow
        label="Do Not Track"
        detected={trackingDetection.doNotTrack}
        notDetectedText="Disabled"
      />
      <DataRow
        label="Global Privacy Control"
        value={trackingDetection.globalPrivacyControl === null ? '—' : trackingDetection.globalPrivacyControl ? 'Enabled' : 'Disabled'}
      />
    </DataSection>
  );
}

export function BrowserAnalysisSection() {
  const { browser, botDetection } = useProfileStore();
  
  // Extract browser name and version
  const getBrowserInfo = () => {
    const ua = browser.userAgent;
    if (ua.includes('Firefox')) {
      const match = ua.match(/Firefox\/(\d+\.\d+)/);
      return `Firefox ${match?.[1] || ''}`;
    }
    if (ua.includes('Edg')) {
      const match = ua.match(/Edg\/(\d+\.\d+)/);
      return `Edge ${match?.[1] || ''}`;
    }
    if (ua.includes('Chrome')) {
      const match = ua.match(/Chrome\/(\d+\.\d+)/);
      return `Chrome ${match?.[1] || ''}`;
    }
    if (ua.includes('Safari')) {
      const match = ua.match(/Version\/(\d+\.\d+)/);
      return `Safari ${match?.[1] || ''}`;
    }
    return 'Unknown';
  };

  const getHardwareFamily = () => {
    if (browser.mobile) return 'Mobile Device';
    if (browser.platform.includes('Win')) return 'Windows PC';
    if (browser.platform.includes('Mac')) return 'Mac';
    if (browser.platform.includes('Linux')) return 'Linux PC';
    return 'Unknown';
  };

  return (
    <DataSection title="Browser Analysis" icon={<Globe size={14} />} iconColor="text-cyber-cyan">
      <DataRow label="Browser" value={getBrowserInfo()} />
      <DataRow label="Hardware Family" value={getHardwareFamily()} />
      <StatusRow label="Incognito Mode" detected={botDetection.incognitoMode} />
      <StatusRow label="Automated" detected={botDetection.isAutomated} alertOnDetect />
      <StatusRow label="Headless" detected={botDetection.isHeadless} alertOnDetect />
      <StatusRow label="Virtual Machine" detected={botDetection.isVirtualMachine} alertOnDetect />
      <DataRow label="Session History Length (tab)" value={browser.historyLength} />
    </DataSection>
  );
}

export function SocialLoginsSection() {
  const { socialLogins } = useProfileStore();

  return (
    <DataSection title="Logged Into" icon={<User size={14} />} iconColor="text-cyber-cyan">
      <StatusRow
        label="Google"
        detected={socialLogins.google}
        detectedText="Logged In"
        notDetectedText="Not Logged In"
      />
      <StatusRow
        label="Facebook"
        detected={socialLogins.facebook}
        detectedText="Logged In"
        notDetectedText="Not Logged In"
      />
      <StatusRow
        label="Twitter"
        detected={socialLogins.twitter}
        detectedText="Logged In"
        notDetectedText="Not Logged In"
      />
      <StatusRow
        label="GitHub"
        detected={socialLogins.github}
        detectedText="Logged In"
        notDetectedText="Not Logged In"
      />
      <StatusRow
        label="Reddit"
        detected={socialLogins.reddit}
        detectedText="Logged In"
        notDetectedText="Not Logged In"
      />
    </DataSection>
  );
}

export function CryptoWalletsSection() {
  const { cryptoWallets } = useProfileStore();

  return (
    <DataSection title="Crypto Wallets" icon={<Wallet size={14} />} iconColor="text-cyber-purple">
      <StatusRow
        label="Phantom"
        detected={cryptoWallets.phantom}
        detectedText="Connected"
        notDetectedText="Not detected"
      />
      <StatusRow
        label="MetaMask"
        detected={cryptoWallets.metamask}
        detectedText="Connected"
        notDetectedText="Not detected"
      />
      <StatusRow
        label="Coinbase"
        detected={cryptoWallets.coinbase}
        detectedText="Connected"
        notDetectedText="Not detected"
      />
    </DataSection>
  );
}

export function VPNDetectionSection() {
  const { vpnDetection } = useProfileStore();

  return (
    <DataSection title="VPN/Proxy Detection" icon={<Eye size={14} />} iconColor="text-cyber-cyan">
      <StatusRow
        label="Likely Using VPN"
        detected={vpnDetection.likelyUsingVPN}
      />
      <StatusRow
        label="Timezone Mismatch"
        detected={vpnDetection.timezoneMismatch}
        alertOnDetect
      />
      <StatusRow
        label="WebRTC Leak"
        detected={vpnDetection.webrtcLeak}
        alertOnDetect
      />
    </DataSection>
  );
}
