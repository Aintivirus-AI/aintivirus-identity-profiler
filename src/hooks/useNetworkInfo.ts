import { useEffect } from 'react';
import { useProfileStore } from '../store/useProfileStore';

// Response types for different APIs
interface IpApiCoResponse {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  org: string;
  latitude: number;
  longitude: number;
  timezone: string;
  error?: boolean;
  reason?: string;
}

interface IpInfoResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string; // "lat,lon" format
  org: string;
  timezone: string;
}

interface NetworkInformation extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
  }
}

// Normalize response from different APIs
interface NormalizedLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  isp: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Country code to full name mapping for APIs that don't provide it
const countryNames: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  CN: 'China',
  IN: 'India',
  BR: 'Brazil',
  // Add more as needed
};

export function useNetworkInfo() {
  const { setNetwork, addConsoleEntry } = useProfileStore();

  useEffect(() => {
    // Get Network Information API data
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      setNetwork({
        connectionType: connection.effectiveType || null,
        downlink: connection.downlink || null,
        rtt: connection.rtt || null,
        dataSaver: connection.saveData || false,
      });

      addConsoleEntry('DATA', `Connection: ${connection.effectiveType || 'unknown'}`);
      if (connection.downlink) {
        addConsoleEntry('DATA', `Downlink: ${connection.downlink} Mbps`);
      }
      if (connection.rtt) {
        addConsoleEntry('DATA', `RTT: ${connection.rtt} ms`);
      }

      // Listen for connection changes
      connection.addEventListener('change', () => {
        setNetwork({
          connectionType: connection.effectiveType || null,
          downlink: connection.downlink || null,
          rtt: connection.rtt || null,
          dataSaver: connection.saveData || false,
        });
      });
    }

    // Try multiple APIs with fallback (all HTTPS, no API key required)
    const fetchFromIpApiCo = async (): Promise<NormalizedLocation> => {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data: IpApiCoResponse = await response.json();
      if (data.error) throw new Error(data.reason || 'API error');
      
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        isp: data.org || 'Unknown',
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
      };
    };

    const fetchFromIpInfo = async (): Promise<NormalizedLocation> => {
      const response = await fetch('https://ipinfo.io/json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data: IpInfoResponse = await response.json();
      const [lat, lon] = (data.loc || '0,0').split(',').map(Number);
      
      return {
        ip: data.ip,
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
        country: countryNames[data.country] || data.country,
        countryCode: data.country,
        isp: data.org || 'Unknown',
        latitude: lat,
        longitude: lon,
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    };

    const fetchNetworkInfo = async () => {
      addConsoleEntry('SCAN', 'Tracing network origin...');
      setNetwork({ loading: true, error: null });

      // List of API fetchers to try in order
      const apiFetchers = [
        { name: 'ipapi.co', fetch: fetchFromIpApiCo },
        { name: 'ipinfo.io', fetch: fetchFromIpInfo },
      ];

      let lastError: Error | null = null;

      for (const api of apiFetchers) {
        try {
          addConsoleEntry('SCAN', `Trying ${api.name}...`);
          const data = await api.fetch();

          // Validate we got real coordinates
          if (data.latitude === 0 && data.longitude === 0) {
            throw new Error('Invalid coordinates');
          }

          setNetwork({
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country,
            countryCode: data.countryCode,
            isp: data.isp,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone,
            loading: false,
            error: null,
          });

          addConsoleEntry('DATA', `IP Traced: ${data.ip}`);
          addConsoleEntry('DATA', `Location: ${data.city}, ${data.region}, ${data.country}`);
          addConsoleEntry('DATA', `ISP: ${data.isp}`);
          addConsoleEntry('DATA', `Coordinates: ${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`);
          addConsoleEntry('SYSTEM', `Network trace complete (via ${api.name})`);
          
          return; // Success, exit the loop
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          addConsoleEntry('ALERT', `${api.name} failed: ${lastError.message}`);
          // Continue to next API
        }
      }

      // All APIs failed
      const errorMessage = lastError?.message || 'All geolocation APIs failed';
      setNetwork({ loading: false, error: errorMessage });
      addConsoleEntry('ALERT', `Network trace failed: ${errorMessage}`);
    };

    fetchNetworkInfo();
  }, [setNetwork, addConsoleEntry]);
}
