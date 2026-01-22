// AI Analysis Engine - Generates heuristic-based insights from collected data
// Uses data-driven correlations and statistical models - no LLM needed
// Predictions are based on correlating multiple data signals for accuracy

import type {
  HardwareData,
  NetworkData,
  BrowserData,
  BotDetectionData,
  BehavioralData,
  CryptoWallets,
  SocialLogins,
  VPNDetection,
  TrackingDetection,
  APISupport,
  AIAnalysis,
  PersonalLifeGuesses,
  MentalPhysicalState,
  LifestyleHabits,
  FinancialProfile,
  UserProfileFlags,
  PersonalityTraits,
  InferredInterests,
} from '../store/useProfileStore';

// ============================================
// CONSTANTS AND LOOKUP TABLES
// ============================================

// GPU tier detection with pricing data
const GPU_DATABASE: Record<string, { tier: 'budget' | 'mid' | 'high' | 'premium'; msrp: number; year: number }> = {
  // NVIDIA Premium
  'rtx 4090': { tier: 'premium', msrp: 1599, year: 2022 },
  'rtx 4080': { tier: 'premium', msrp: 1199, year: 2022 },
  'rtx 4070 ti': { tier: 'high', msrp: 799, year: 2023 },
  'rtx 4070': { tier: 'high', msrp: 599, year: 2023 },
  'rtx 3090 ti': { tier: 'premium', msrp: 1999, year: 2022 },
  'rtx 3090': { tier: 'premium', msrp: 1499, year: 2020 },
  'rtx 3080 ti': { tier: 'high', msrp: 1199, year: 2021 },
  'rtx 3080': { tier: 'high', msrp: 699, year: 2020 },
  'rtx 3070 ti': { tier: 'high', msrp: 599, year: 2021 },
  'rtx 3070': { tier: 'high', msrp: 499, year: 2020 },
  // NVIDIA Mid
  'rtx 4060 ti': { tier: 'mid', msrp: 449, year: 2023 },
  'rtx 4060': { tier: 'mid', msrp: 299, year: 2023 },
  'rtx 3060 ti': { tier: 'mid', msrp: 399, year: 2020 },
  'rtx 3060': { tier: 'mid', msrp: 329, year: 2021 },
  'rtx 2080 ti': { tier: 'high', msrp: 999, year: 2018 },
  'rtx 2080': { tier: 'high', msrp: 699, year: 2018 },
  'rtx 2070': { tier: 'mid', msrp: 499, year: 2018 },
  'rtx 2060': { tier: 'mid', msrp: 349, year: 2019 },
  // NVIDIA Budget
  'gtx 1660 ti': { tier: 'mid', msrp: 279, year: 2019 },
  'gtx 1660': { tier: 'mid', msrp: 219, year: 2019 },
  'gtx 1650': { tier: 'budget', msrp: 149, year: 2019 },
  'gtx 1080 ti': { tier: 'high', msrp: 699, year: 2017 },
  'gtx 1080': { tier: 'mid', msrp: 599, year: 2016 },
  'gtx 1070': { tier: 'mid', msrp: 379, year: 2016 },
  'gtx 1060': { tier: 'budget', msrp: 249, year: 2016 },
  'gtx 1050': { tier: 'budget', msrp: 109, year: 2016 },
  // AMD High-end
  'rx 7900 xtx': { tier: 'premium', msrp: 999, year: 2022 },
  'rx 7900 xt': { tier: 'high', msrp: 899, year: 2022 },
  'rx 7800 xt': { tier: 'high', msrp: 499, year: 2023 },
  'rx 7700 xt': { tier: 'mid', msrp: 449, year: 2023 },
  'rx 7600': { tier: 'mid', msrp: 269, year: 2023 },
  'rx 6900 xt': { tier: 'high', msrp: 999, year: 2020 },
  'rx 6800 xt': { tier: 'high', msrp: 649, year: 2020 },
  'rx 6800': { tier: 'high', msrp: 579, year: 2020 },
  'rx 6700 xt': { tier: 'mid', msrp: 479, year: 2021 },
  'rx 6600 xt': { tier: 'mid', msrp: 379, year: 2021 },
  'rx 6600': { tier: 'mid', msrp: 329, year: 2021 },
  'rx 5700 xt': { tier: 'mid', msrp: 399, year: 2019 },
  'rx 5700': { tier: 'mid', msrp: 349, year: 2019 },
  'rx 580': { tier: 'budget', msrp: 199, year: 2017 },
  'rx 570': { tier: 'budget', msrp: 169, year: 2017 },
  // Apple Silicon
  'm3 max': { tier: 'premium', msrp: 3199, year: 2023 },
  'm3 pro': { tier: 'high', msrp: 1999, year: 2023 },
  'm3': { tier: 'mid', msrp: 1299, year: 2023 },
  'm2 ultra': { tier: 'premium', msrp: 4999, year: 2023 },
  'm2 max': { tier: 'premium', msrp: 2999, year: 2023 },
  'm2 pro': { tier: 'high', msrp: 1999, year: 2023 },
  'm2': { tier: 'mid', msrp: 1199, year: 2022 },
  'm1 ultra': { tier: 'premium', msrp: 3999, year: 2022 },
  'm1 max': { tier: 'high', msrp: 2499, year: 2021 },
  'm1 pro': { tier: 'high', msrp: 1999, year: 2021 },
  'm1': { tier: 'mid', msrp: 999, year: 2020 },
  // Intel Integrated
  'iris xe': { tier: 'budget', msrp: 0, year: 2020 },
  'uhd graphics': { tier: 'budget', msrp: 0, year: 2018 },
  'hd graphics': { tier: 'budget', msrp: 0, year: 2015 },
  // Workstation
  'quadro rtx': { tier: 'premium', msrp: 2500, year: 2019 },
  'quadro': { tier: 'high', msrp: 1500, year: 2018 },
  'tesla': { tier: 'premium', msrp: 5000, year: 2018 },
  'a100': { tier: 'premium', msrp: 10000, year: 2020 },
  'a6000': { tier: 'premium', msrp: 4650, year: 2020 },
};

// Screen resolution patterns by typical user type
const SCREEN_PATTERNS = {
  professional: [
    { w: 2560, h: 1440 },  // 1440p monitor
    { w: 3440, h: 1440 },  // Ultrawide
    { w: 3840, h: 2160 },  // 4K
    { w: 5120, h: 2880 },  // 5K
    { w: 6016, h: 3384 },  // Pro Display XDR
    { w: 2560, h: 1600 },  // MacBook Pro 14"
    { w: 3024, h: 1964 },  // MacBook Pro 16"
    { w: 3456, h: 2234 },  // MacBook Pro 16" M3
  ],
  gaming: [
    { w: 1920, h: 1080 },  // 1080p
    { w: 2560, h: 1080 },  // Ultrawide 1080p
    { w: 2560, h: 1440 },  // 1440p
    { w: 3440, h: 1440 },  // Ultrawide 1440p
    { w: 3840, h: 2160 },  // 4K gaming
  ],
  budget: [
    { w: 1366, h: 768 },   // Budget laptop
    { w: 1280, h: 720 },   // HD
    { w: 1440, h: 900 },   // Older laptop
    { w: 1600, h: 900 },   // Mid laptop
  ],
  mobile: [
    { w: 390, h: 844 },    // iPhone 14 Pro
    { w: 430, h: 932 },    // iPhone 15 Pro Max
    { w: 412, h: 915 },    // Android
    { w: 360, h: 800 },    // Android budget
    { w: 768, h: 1024 },   // iPad
    { w: 820, h: 1180 },   // iPad Air
    { w: 1024, h: 1366 }, // iPad Pro
  ],
};

// ISP patterns for income inference
const ISP_TIERS = {
  enterprise: ['enterprise', 'business', 'corporate', 'dedicated', 'fiber pro', 'gigabit business'],
  premium: ['comcast business', 'at&t fiber', 'verizon fios', 'google fiber', 'cox business', 'sonic'],
  standard: ['spectrum', 'xfinity', 'cox', 'mediacom', 'frontier', 'centurylink', 'windstream'],
  budget: ['mobile', 'wireless', 'prepaid', 'cricket', 'boost', 'metro'],
  datacenter: ['amazon', 'google cloud', 'microsoft', 'digitalocean', 'vultr', 'linode', 'cloudflare', 'ovh'],
};

// Cost of living index by region (simplified)
const COST_OF_LIVING: Record<string, number> = {
  'San Francisco': 1.8, 'New York': 1.7, 'Los Angeles': 1.5, 'Seattle': 1.4, 'Boston': 1.4,
  'Washington': 1.3, 'San Diego': 1.3, 'Denver': 1.2, 'Austin': 1.2, 'Chicago': 1.1,
  'London': 1.6, 'Zurich': 2.0, 'Singapore': 1.5, 'Tokyo': 1.3, 'Sydney': 1.4,
  'Toronto': 1.2, 'Vancouver': 1.3, 'Amsterdam': 1.3, 'Paris': 1.4, 'Berlin': 1.1,
  'Dubai': 1.3, 'Hong Kong': 1.7, 'Mumbai': 0.6, 'Bangalore': 0.5, 'Manila': 0.4,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getGPUInfo(gpu: string | null): { tier: 'budget' | 'mid' | 'high' | 'premium'; msrp: number; year: number } | null {
  if (!gpu) return null;
  const gpuLower = gpu.toLowerCase();
  
  for (const [pattern, info] of Object.entries(GPU_DATABASE)) {
    if (gpuLower.includes(pattern)) {
      return info;
    }
  }
  
  // Fallback heuristics
  if (gpuLower.includes('intel') || gpuLower.includes('uhd') || gpuLower.includes('hd graphics')) {
    return { tier: 'budget', msrp: 0, year: 2018 };
  }
  if (gpuLower.includes('amd') || gpuLower.includes('radeon')) {
    return { tier: 'mid', msrp: 300, year: 2019 };
  }
  if (gpuLower.includes('nvidia') || gpuLower.includes('geforce')) {
    return { tier: 'mid', msrp: 400, year: 2019 };
  }
  
  return { tier: 'mid', msrp: 300, year: 2019 };
}


function isProfessionalScreen(width: number, height: number): boolean {
  return SCREEN_PATTERNS.professional.some(s => s.w === width && s.h === height) ||
         (width >= 2560 && height >= 1440);
}

function isBudgetScreen(width: number, height: number): boolean {
  return SCREEN_PATTERNS.budget.some(s => s.w === width && s.h === height) ||
         (width <= 1600 && height <= 900);
}

function getISPTier(isp: string | null): 'enterprise' | 'premium' | 'standard' | 'budget' | 'datacenter' | 'unknown' {
  if (!isp) return 'unknown';
  const ispLower = isp.toLowerCase();
  
  for (const [tier, keywords] of Object.entries(ISP_TIERS)) {
    if (keywords.some(kw => ispLower.includes(kw))) {
      return tier as 'enterprise' | 'premium' | 'standard' | 'budget' | 'datacenter';
    }
  }
  
  return 'standard';
}

function getCostOfLivingMultiplier(city: string | null): number {
  if (!city) return 1.0;
  return COST_OF_LIVING[city] || 1.0;
}

function getHourBucket(hour: number): 'early_morning' | 'morning' | 'work_hours' | 'afternoon' | 'evening' | 'night' | 'late_night' {
  if (hour >= 5 && hour < 7) return 'early_morning';
  if (hour >= 7 && hour < 9) return 'morning';
  if (hour >= 9 && hour < 17) return 'work_hours';
  if (hour >= 17 && hour < 19) return 'afternoon';
  if (hour >= 19 && hour < 22) return 'evening';
  if (hour >= 22 || hour < 1) return 'night';
  return 'late_night';
}


// ============================================
// AGE RANGE PREDICTION
// ============================================

function predictAgeRange(
  hardware: HardwareData,
  browser: BrowserData,
  behavioral: BehavioralData,
  _network: NetworkData,
  botDetection: BotDetectionData,
  cryptoWallets: CryptoWallets,
  trackingDetection: TrackingDetection
): { range: string; confidence: number; reasoning: string[] } {
  const hour = new Date().getHours();
  const hourBucket = getHourBucket(hour);
  const reasoning: string[] = [];
  
  // Scoring system: positive = younger, negative = older
  let ageScore = 0;
  let dataPoints = 0;
  
  // Time-based signals
  if (hourBucket === 'late_night' || hourBucket === 'night') {
    ageScore += 2; // Younger users tend to browse late
    reasoning.push('Late night browsing suggests younger demographic');
    dataPoints++;
  } else if (hourBucket === 'early_morning') {
    ageScore -= 2; // Older users often browse early
    reasoning.push('Early morning browsing suggests mature demographic');
    dataPoints++;
  }
  
  // Device signals
  const gpuInfo = getGPUInfo(hardware.gpu);
  if (gpuInfo) {
    if (gpuInfo.tier === 'premium' || gpuInfo.tier === 'high') {
      // Gaming GPUs often indicate younger users, workstation GPUs indicate professionals
      if (hardware.gpu?.toLowerCase().includes('rtx 4') || hardware.gpu?.toLowerCase().includes('rx 7')) {
        ageScore += 1; // Latest gaming hardware
        reasoning.push('Latest generation GPU suggests younger tech enthusiast');
      } else if (hardware.gpu?.toLowerCase().includes('quadro') || hardware.gpu?.toLowerCase().includes('a100')) {
        ageScore -= 1; // Professional workstation
        reasoning.push('Professional workstation GPU suggests established career');
      }
      dataPoints++;
    }
    if (gpuInfo.tier === 'budget') {
      // Could be young student or older casual user
      if (hardware.cpuCores && hardware.cpuCores < 4) {
        ageScore -= 1; // Older or very budget machine
      }
    }
  }
  
  // Apple Silicon suggests specific demographics
  if (hardware.gpu?.toLowerCase().includes('m1') || hardware.gpu?.toLowerCase().includes('m2') || hardware.gpu?.toLowerCase().includes('m3')) {
    ageScore -= 0.5; // Mac users tend slightly older/professional
    reasoning.push('Apple Silicon suggests design/creative professional demographic');
    dataPoints++;
  }
  
  // Language preferences
  if (browser.languages.length > 2) {
    ageScore += 0.5; // Multilingual often younger or international
    reasoning.push('Multiple languages suggest younger or internationally-minded user');
    dataPoints++;
  }
  
  // Crypto wallets - strong youth indicator
  if (cryptoWallets.hasAnyWallet) {
    ageScore += 2;
    reasoning.push('Crypto wallet presence suggests tech-forward, likely under 40');
    dataPoints++;
    
    if (cryptoWallets.phantom || cryptoWallets.solflare) {
      ageScore += 1; // Solana ecosystem tends younger
      reasoning.push('Solana ecosystem wallet suggests likely under 35');
    }
  }
  
  // Privacy tools usage
  if (trackingDetection.adBlocker) {
    ageScore += 0.5; // Younger users more likely to use ad blockers
    dataPoints++;
  }
  
  // DevTools/developer signals
  if (botDetection.devToolsOpen) {
    ageScore += 1; // Developers often younger
    reasoning.push('Developer tools usage suggests tech professional, likely 22-38');
    dataPoints++;
  }
  
  // Browser extensions detection (React/Vue DevTools = developer)
  if (browser.userAgent.includes('Developer') || browser.userAgent.includes('Canary')) {
    ageScore += 1;
    reasoning.push('Developer browser variant suggests 22-35 age range');
    dataPoints++;
  }
  
  // Screen resolution patterns
  if (isProfessionalScreen(hardware.screenWidth, hardware.screenHeight)) {
    if (hardware.screenWidth >= 3440) {
      // Ultrawide or high-end
      ageScore -= 0.5; // More established/can afford
    }
    dataPoints++;
  }
  
  if (isBudgetScreen(hardware.screenWidth, hardware.screenHeight)) {
    // Budget screen could be student (young) or elderly (casual)
    // Cross-reference with other signals
    if (gpuInfo && gpuInfo.tier !== 'budget') {
      // Decent GPU but budget screen = probably young, money goes to PC not monitor
      ageScore += 1;
    }
    dataPoints++;
  }
  
  // Typing speed can indicate age (generational differences)
  if (behavioral.typing.averageWPM > 0) {
    if (behavioral.typing.averageWPM > 70) {
      ageScore += 1; // Fast typing = grew up with computers
      reasoning.push('Fast typing speed suggests digital native');
      dataPoints++;
    } else if (behavioral.typing.averageWPM < 30 && behavioral.typing.totalKeystrokes > 20) {
      ageScore -= 1; // Slow deliberate typing
      dataPoints++;
    }
  }
  
  // Mobile usage patterns
  if (hardware.touchSupport && hardware.maxTouchPoints > 5) {
    ageScore += 0.5; // Mobile-first often younger
    dataPoints++;
  }
  
  // Calculate final age range
  const normalizedScore = ageScore / Math.max(dataPoints, 1);
  
  let range: string;
  let confidence = Math.min(35 + (dataPoints * 8), 85);
  
  if (normalizedScore >= 2) {
    range = '16-24';
  } else if (normalizedScore >= 1) {
    range = '22-30';
  } else if (normalizedScore >= 0.5) {
    range = '25-34';
  } else if (normalizedScore >= -0.5) {
    range = '28-38';
  } else if (normalizedScore >= -1) {
    range = '32-45';
  } else if (normalizedScore >= -2) {
    range = '40-55';
  } else {
    range = '50+';
  }
  
  return { range, confidence, reasoning };
}

// ============================================
// INCOME LEVEL PREDICTION  
// ============================================

function predictIncomeLevel(
  hardware: HardwareData,
  network: NetworkData,
  browser: BrowserData,
  trackingDetection: TrackingDetection
): { level: 'poverty' | 'low' | 'lower-middle' | 'middle' | 'upper-middle' | 'high' | 'wealthy'; 
     estimate: string; confidence: number; reasoning: string[] } {
  
  const reasoning: string[] = [];
  let incomeScore = 50; // Start at middle (50/100 scale)
  let dataPoints = 0;
  
  // GPU-based scoring (major signal)
  const gpuInfo = getGPUInfo(hardware.gpu);
  if (gpuInfo) {
    if (gpuInfo.tier === 'premium') {
      incomeScore += 25;
      reasoning.push(`Premium GPU (${hardware.gpu?.split(' ').slice(0, 3).join(' ')}...) indicates high disposable income`);
    } else if (gpuInfo.tier === 'high') {
      incomeScore += 15;
      reasoning.push('High-end GPU indicates above-average income');
    } else if (gpuInfo.tier === 'mid') {
      incomeScore += 0;
      reasoning.push('Mid-range GPU suggests middle income');
    } else {
      incomeScore -= 10;
      reasoning.push('Budget/integrated GPU suggests cost-conscious');
    }
    dataPoints++;
    
    // Age of hardware matters too
    const yearsOld = new Date().getFullYear() - gpuInfo.year;
    if (yearsOld >= 5) {
      incomeScore -= 5;
      reasoning.push('Older hardware suggests budget constraints');
    } else if (yearsOld <= 1) {
      incomeScore += 10;
      reasoning.push('Latest generation hardware indicates willingness to spend');
    }
    dataPoints++;
  }
  
  // Screen setup analysis
  if (isProfessionalScreen(hardware.screenWidth, hardware.screenHeight)) {
    incomeScore += 10;
    reasoning.push('Professional-grade display indicates established career');
    dataPoints++;
    
    if (hardware.screenWidth >= 3440) {
      incomeScore += 5; // Ultrawide = extra expense
    }
    if (hardware.pixelRatio >= 2) {
      incomeScore += 5; // High DPI displays are more expensive
    }
  } else if (isBudgetScreen(hardware.screenWidth, hardware.screenHeight)) {
    incomeScore -= 5;
    dataPoints++;
  }
  
  // CPU cores (proxy for computer quality)
  if (hardware.cpuCores) {
    if (hardware.cpuCores >= 16) {
      incomeScore += 15;
      reasoning.push(`${hardware.cpuCores}-core CPU suggests high-end workstation`);
    } else if (hardware.cpuCores >= 8) {
      incomeScore += 5;
      reasoning.push('8+ core CPU suggests capable machine');
    } else if (hardware.cpuCores <= 4) {
      incomeScore -= 5;
    }
    dataPoints++;
  }
  
  // RAM (if available)
  if (hardware.ram) {
    if (hardware.ram >= 32) {
      incomeScore += 10;
      reasoning.push(`${hardware.ram}GB RAM indicates professional-grade system`);
    } else if (hardware.ram >= 16) {
      incomeScore += 3;
    } else if (hardware.ram <= 8) {
      incomeScore -= 5;
    }
    dataPoints++;
  }
  
  // ISP analysis
  const ispTier = getISPTier(network.isp);
  if (ispTier === 'enterprise') {
    incomeScore += 20;
    reasoning.push('Enterprise-grade internet suggests business owner or high-level position');
  } else if (ispTier === 'premium') {
    incomeScore += 10;
    reasoning.push('Premium ISP suggests comfortable income');
  } else if (ispTier === 'budget') {
    incomeScore -= 10;
    reasoning.push('Budget ISP suggests cost-conscious');
  } else if (ispTier === 'datacenter') {
    // Could be VPN, developer testing, etc - don't assume income
    reasoning.push('Datacenter IP suggests tech-savvy user, possibly using VPN');
  }
  dataPoints++;
  
  // Location cost of living adjustment
  const colMultiplier = getCostOfLivingMultiplier(network.city);
  if (colMultiplier > 1.3 && incomeScore > 40) {
    incomeScore += 10;
    reasoning.push(`High cost of living area (${network.city}) suggests higher income to sustain`);
    dataPoints++;
  } else if (colMultiplier < 0.7 && incomeScore > 60) {
    // High apparent income in low COL area = actually wealthy
    incomeScore += 5;
  }
  
  // Apple ecosystem indicator
  if (browser.vendor.toLowerCase().includes('apple') || 
      hardware.gpu?.toLowerCase().includes('m1') || 
      hardware.gpu?.toLowerCase().includes('m2') ||
      hardware.gpu?.toLowerCase().includes('m3')) {
    incomeScore += 8;
    reasoning.push('Apple ecosystem indicates higher spending power');
    dataPoints++;
  }
  
  // Privacy consciousness can correlate with income (professionals more aware)
  if (trackingDetection.adBlocker && trackingDetection.doNotTrack) {
    incomeScore += 3;
    dataPoints++;
  }
  
  // Normalize score
  incomeScore = Math.max(0, Math.min(100, incomeScore));
  
  // Map score to income levels and estimates
  let level: 'poverty' | 'low' | 'lower-middle' | 'middle' | 'upper-middle' | 'high' | 'wealthy';
  let estimate: string;
  
  if (incomeScore >= 85) {
    level = 'wealthy';
    estimate = '$200k+/year';
  } else if (incomeScore >= 70) {
    level = 'high';
    estimate = '$120k-$200k/year';
  } else if (incomeScore >= 58) {
    level = 'upper-middle';
    estimate = '$80k-$120k/year';
  } else if (incomeScore >= 45) {
    level = 'middle';
    estimate = '$50k-$80k/year';
  } else if (incomeScore >= 30) {
    level = 'lower-middle';
    estimate = '$30k-$50k/year';
  } else if (incomeScore >= 15) {
    level = 'low';
    estimate = '$15k-$30k/year';
  } else {
    level = 'poverty';
    estimate = '<$15k/year';
  }
  
  // Adjust for cost of living
  if (colMultiplier > 1) {
    estimate = `${estimate} (${network.city || 'HCOL'} adjusted)`;
  }
  
  const confidence = Math.min(30 + (dataPoints * 7), 75);
  
  return { level, estimate, confidence, reasoning };
}

// ============================================
// OCCUPATION PREDICTION
// ============================================

function predictOccupation(
  hardware: HardwareData,
  browser: BrowserData,
  behavioral: BehavioralData,
  botDetection: BotDetectionData,
  cryptoWallets: CryptoWallets,
  apiSupport: APISupport,
  network: NetworkData
): { occupation: string; confidence: number; reasoning: string[] } {
  const reasoning: string[] = [];
  const scores: Record<string, number> = {};
  
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isWorkHours = hour >= 9 && hour < 17;
  
  // Developer signals
  let devScore = 0;
  if (botDetection.devToolsOpen) {
    devScore += 40;
    reasoning.push('DevTools open strongly indicates developer');
  }
  if (browser.userAgent.includes('Developer') || browser.userAgent.includes('Canary') || browser.userAgent.includes('Nightly')) {
    devScore += 30;
    reasoning.push('Developer browser variant used');
  }
  if (hardware.cpuCores && hardware.cpuCores >= 8) {
    devScore += 15;
  }
  if (hardware.ram && hardware.ram >= 16) {
    devScore += 10;
  }
  if (apiSupport.webAssembly && apiSupport.webgpu) {
    devScore += 10;
    reasoning.push('Modern web APIs supported and likely used');
  }
  // Typing speed matters for developers
  if (behavioral.typing.averageWPM > 60) {
    devScore += 15;
    reasoning.push('Fast typing speed (${behavioral.typing.averageWPM} WPM) suggests professional typist');
  }
  scores['Software Developer'] = devScore;
  
  // Designer signals
  let designScore = 0;
  if (hardware.pixelRatio >= 2) {
    designScore += 20;
    reasoning.push('High DPI display preferred by designers');
  }
  if (hardware.colorDepth >= 30) {
    designScore += 15;
  }
  const gpuInfo = getGPUInfo(hardware.gpu);
  if (gpuInfo && (hardware.gpu?.toLowerCase().includes('quadro') || hardware.gpu?.toLowerCase().includes('m1') || hardware.gpu?.toLowerCase().includes('m2') || hardware.gpu?.toLowerCase().includes('m3'))) {
    designScore += 25;
    reasoning.push('Creative workstation GPU detected');
  }
  if (isProfessionalScreen(hardware.screenWidth, hardware.screenHeight)) {
    designScore += 15;
  }
  scores['Designer/Creative'] = designScore;
  
  // Gamer (could be streamer/esports)
  let gamerScore = 0;
  if (gpuInfo && gpuInfo.tier === 'premium') {
    gamerScore += 30;
  } else if (gpuInfo && gpuInfo.tier === 'high') {
    gamerScore += 20;
  }
  if (apiSupport.gamepads) {
    gamerScore += 15;
  }
  if (hardware.screenWidth >= 2560 && hardware.screenHeight >= 1440) {
    gamerScore += 10;
  }
  // Late night = gaming?
  if ((hour >= 22 || hour < 3) && !isWorkHours) {
    gamerScore += 10;
  }
  scores['Gamer/Streamer'] = gamerScore;
  
  // Crypto/Finance
  let cryptoScore = 0;
  if (cryptoWallets.hasAnyWallet) {
    cryptoScore += 40;
    reasoning.push('Crypto wallet detected');
    
    const walletCount = [cryptoWallets.phantom, cryptoWallets.metamask, cryptoWallets.coinbase, 
                        cryptoWallets.braveWallet, cryptoWallets.trustWallet].filter(Boolean).length;
    if (walletCount >= 2) {
      cryptoScore += 20;
      reasoning.push('Multiple crypto wallets suggest active trader/investor');
    }
  }
  scores['Crypto/Finance'] = cryptoScore;
  
  // Standard office worker
  let officeScore = 30; // Base score
  if (isWorkHours && !isWeekend) {
    officeScore += 20;
    reasoning.push('Browsing during standard work hours');
  }
  if (isBudgetScreen(hardware.screenWidth, hardware.screenHeight)) {
    officeScore += 10; // Corporate issued laptop
  }
  // Standard Windows machine
  if (browser.platform.toLowerCase().includes('win') && !gpuInfo?.tier) {
    officeScore += 10;
  }
  scores['Office Worker'] = officeScore;
  
  // Student signals
  let studentScore = 0;
  if (isBudgetScreen(hardware.screenWidth, hardware.screenHeight)) {
    studentScore += 10;
  }
  if (gpuInfo && gpuInfo.tier === 'budget') {
    studentScore += 15;
  }
  // Late night study?
  if (hour >= 23 || hour < 4) {
    studentScore += 10;
  }
  // Multiple languages = international student?
  if (browser.languages.length > 2) {
    studentScore += 10;
  }
  scores['Student'] = studentScore;
  
  // Freelancer/Remote worker
  let freelanceScore = 0;
  if (!isWorkHours && !isWeekend) {
    freelanceScore += 15;
    reasoning.push('Non-traditional browsing hours suggest flexible schedule');
  }
  if (isWeekend && isWorkHours) {
    freelanceScore += 10;
  }
  // Good equipment but not enterprise ISP
  const ispTier = getISPTier(network.isp);
  if (gpuInfo && (gpuInfo.tier === 'mid' || gpuInfo.tier === 'high') && ispTier !== 'enterprise') {
    freelanceScore += 15;
  }
  scores['Freelancer/Remote Worker'] = freelanceScore;
  
  // Find highest scoring occupation
  const sortedOccupations = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topOccupation, topScore] = sortedOccupations[0];
  const [secondOccupation, secondScore] = sortedOccupations[1] || ['Unknown', 0];
  
  // If scores are close, mention both
  let occupation: string;
  if (topScore >= 50) {
    if (secondScore >= topScore * 0.8) {
      occupation = `${topOccupation} / ${secondOccupation}`;
    } else {
      occupation = topOccupation;
    }
  } else if (topScore >= 30) {
    occupation = `Likely ${topOccupation}`;
  } else {
    occupation = 'General professional';
  }
  
  const confidence = Math.min(topScore, 85);
  
  return { occupation, confidence, reasoning };
}

// ============================================
// DEVICE TIER & VALUE ESTIMATION
// ============================================

function estimateDeviceValue(
  hardware: HardwareData,
  browser: BrowserData
): { tier: 'low-end' | 'mid-range' | 'high-end' | 'premium'; value: string; age: 'new' | 'recent' | 'older' | 'legacy'; reasoning: string[] } {
  const reasoning: string[] = [];
  let totalValue = 0;
  
  const gpuInfo = getGPUInfo(hardware.gpu);
  
  // GPU contribution
  if (gpuInfo) {
    totalValue += gpuInfo.msrp;
    
    // Depreciation based on age
    const yearsOld = new Date().getFullYear() - gpuInfo.year;
    const depreciation = Math.min(yearsOld * 0.15, 0.6); // Max 60% depreciation
    totalValue = totalValue * (1 - depreciation);
    
    reasoning.push(`GPU: ${hardware.gpu?.split(' ').slice(0, 4).join(' ')} (~$${Math.round(totalValue)} current value)`);
  }
  
  // Base system value
  let systemBase = 400; // Minimum system cost
  
  // CPU contribution (estimated from core count)
  if (hardware.cpuCores) {
    if (hardware.cpuCores >= 16) {
      systemBase += 600;
      reasoning.push(`${hardware.cpuCores}-core CPU suggests high-end processor`);
    } else if (hardware.cpuCores >= 8) {
      systemBase += 300;
    } else if (hardware.cpuCores >= 6) {
      systemBase += 150;
    }
  }
  
  // RAM contribution
  if (hardware.ram) {
    if (hardware.ram >= 64) {
      systemBase += 400;
    } else if (hardware.ram >= 32) {
      systemBase += 200;
    } else if (hardware.ram >= 16) {
      systemBase += 80;
    }
  }
  
  // Display value estimate
  if (hardware.screenWidth >= 3840) {
    systemBase += 400; // 4K display
    reasoning.push('4K display adds to system value');
  } else if (hardware.screenWidth >= 2560) {
    systemBase += 200;
  }
  
  if (hardware.pixelRatio >= 2) {
    systemBase += 150; // High DPI displays cost more
  }
  
  // Apple premium
  if (browser.vendor.toLowerCase().includes('apple') || 
      hardware.gpu?.toLowerCase().includes('m1') || 
      hardware.gpu?.toLowerCase().includes('m2') ||
      hardware.gpu?.toLowerCase().includes('m3')) {
    systemBase *= 1.4; // Apple markup
    reasoning.push('Apple ecosystem adds premium');
  }
  
  totalValue += systemBase;
  
  // Determine tier
  let tier: 'low-end' | 'mid-range' | 'high-end' | 'premium';
  if (totalValue >= 3000) {
    tier = 'premium';
  } else if (totalValue >= 1500) {
    tier = 'high-end';
  } else if (totalValue >= 700) {
    tier = 'mid-range';
  } else {
    tier = 'low-end';
  }
  
  // Determine age
  let age: 'new' | 'recent' | 'older' | 'legacy';
  if (gpuInfo) {
    const yearsOld = new Date().getFullYear() - gpuInfo.year;
    if (yearsOld <= 1) {
      age = 'new';
    } else if (yearsOld <= 3) {
      age = 'recent';
    } else if (yearsOld <= 5) {
      age = 'older';
    } else {
      age = 'legacy';
    }
  } else {
    // Estimate from other signals
    if (hardware.cpuCores && hardware.cpuCores >= 8) {
      age = 'recent';
    } else {
      age = 'older';
    }
  }
  
  // Format value string
  const roundedValue = Math.round(totalValue / 100) * 100;
  const value = `$${roundedValue.toLocaleString()}`;
  
  return { tier, value, age, reasoning };
}

// ============================================
// MENTAL STATE ANALYSIS
// ============================================

function analyzeMentalState(
  behavioral: BehavioralData,
  hardware: HardwareData,
  _network: NetworkData
): MentalPhysicalState & { reasoning: string[] } {
  const reasoning: string[] = [];
  const hour = new Date().getHours();
  
  // Stress level analysis
  let stressIndicators = 0;
  let stressTotal = 0;
  
  if (behavioral.emotions.rageClicks > 0) {
    stressTotal += behavioral.emotions.rageClicks * 15;
    stressIndicators++;
    reasoning.push(`${behavioral.emotions.rageClicks} rage click(s) indicate frustration`);
  }
  
  if (behavioral.mouse.erraticMovements > 5) {
    stressTotal += behavioral.mouse.erraticMovements * 2;
    stressIndicators++;
    reasoning.push(`${behavioral.mouse.erraticMovements} erratic mouse movements detected`);
  }
  
  if (behavioral.attention.tabSwitches > 10) {
    stressTotal += 20;
    stressIndicators++;
    reasoning.push('High tab switching suggests scattered attention');
  }
  
  // Typing patterns can indicate stress
  if (behavioral.typing.averageHoldTime > 150 && behavioral.typing.totalKeystrokes > 10) {
    stressTotal += 15; // Long key holds = hesitant/stressed
    stressIndicators++;
  }
  
  let stressLevel: 'low' | 'medium' | 'high' | 'unknown';
  if (stressIndicators === 0 && behavioral.mouse.movements > 50) {
    stressLevel = 'low';
    reasoning.push('Smooth, calm interaction patterns');
  } else if (stressTotal >= 50) {
    stressLevel = 'high';
  } else if (stressTotal >= 25 || stressIndicators >= 2) {
    stressLevel = 'medium';
  } else {
    stressLevel = 'low';
  }
  
  // Sleep schedule inference
  let sleepSchedule: 'early' | 'normal' | 'late' | 'irregular' | 'unknown';
  if (hour >= 4 && hour < 7) {
    sleepSchedule = 'early';
    reasoning.push('Very early morning browsing suggests early riser');
  } else if (hour >= 7 && hour < 23) {
    sleepSchedule = 'normal';
  } else if (hour >= 23 || hour < 2) {
    sleepSchedule = 'late';
    reasoning.push('Late night browsing suggests night owl');
  } else {
    sleepSchedule = 'irregular';
    reasoning.push('Very late night/early morning browsing suggests irregular sleep');
  }
  
  // Fitness level inference (very rough)
  let fitnessLevel: 'active' | 'moderate' | 'sedentary' | 'unknown';
  if (hardware.touchSupport && hardware.maxTouchPoints > 5) {
    // Mobile users might be more active (not sitting at desk)
    fitnessLevel = 'moderate';
  } else if (hour >= 6 && hour < 8) {
    // Early morning desktop use = possibly before gym?
    fitnessLevel = 'moderate';
  } else {
    // Desktop users assumed sedentary (we can't really know)
    fitnessLevel = 'unknown';
  }
  
  // Health consciousness
  let healthConscious: string;
  if (sleepSchedule === 'early' && fitnessLevel === 'moderate') {
    healthConscious = 'Likely health-conscious';
  } else if (sleepSchedule === 'irregular' || hour < 3) {
    healthConscious = 'May not prioritize sleep health';
  } else {
    healthConscious = 'Unknown';
  }
  
  return {
    stressLevel,
    sleepSchedule,
    fitnessLevel,
    healthConscious,
    reasoning,
  };
}

// ============================================
// PERSONAL LIFE GUESSES
// ============================================

// Advanced parent detection algorithm
function predictParentStatus(
  hardware: HardwareData,
  behavioral: BehavioralData,
  network: NetworkData,
  incomeLevel: string,
  ageRange: string,
  socialLogins?: SocialLogins
): { status: string; confidence: number; reasoning: string[] } {
  const reasoning: string[] = [];
  let parentScore = 0; // -100 (definitely not) to +100 (definitely is)
  let dataPoints = 0;
  
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const dayOfWeek = now.getDay();
  const month = now.getMonth();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isWeekday = !isWeekend;
  const isFriday = dayOfWeek === 5;
  
  // Parse age range to get approximate age
  const ageMatch = ageRange.match(/(\d+)/);
  const approxAge = ageMatch ? parseInt(ageMatch[1]) : 30;
  
  // ============================================
  // 1. AGE-BASED SCORING (Foundation)
  // ============================================
  if (approxAge < 22) {
    parentScore -= 40;
    reasoning.push('Age under 22 - statistically unlikely to have children');
    dataPoints++;
  } else if (approxAge >= 22 && approxAge < 26) {
    parentScore -= 15;
    reasoning.push('Age 22-25 - possible but less common parenting age');
    dataPoints++;
  } else if (approxAge >= 26 && approxAge < 30) {
    parentScore += 5;
    reasoning.push('Age 26-29 - entering prime parenting years');
    dataPoints++;
  } else if (approxAge >= 30 && approxAge < 40) {
    parentScore += 20;
    reasoning.push('Age 30-39 - peak parenting probability age range');
    dataPoints++;
  } else if (approxAge >= 40 && approxAge < 50) {
    parentScore += 25;
    reasoning.push('Age 40-49 - very likely to have children (possibly older kids)');
    dataPoints++;
  } else if (approxAge >= 50) {
    parentScore += 15; // Likely has adult children
    reasoning.push('Age 50+ - likely has adult or teenage children');
    dataPoints++;
  }
  
  // ============================================
  // 2. INCOME-BASED CORRELATION
  // ============================================
  // Higher income in prime parenting ages strongly correlates with having children
  if (incomeLevel.includes('high') || incomeLevel.includes('wealthy')) {
    if (approxAge >= 30 && approxAge <= 50) {
      parentScore += 15;
      reasoning.push('High income + prime age = strong family formation indicator');
      dataPoints++;
    } else if (approxAge >= 25 && approxAge < 30) {
      parentScore += 8;
      dataPoints++;
    }
  } else if (incomeLevel.includes('upper-middle') || incomeLevel.includes('middle')) {
    if (approxAge >= 28 && approxAge <= 45) {
      parentScore += 10;
      reasoning.push('Middle-upper income in prime years suggests family');
      dataPoints++;
    }
  } else if (incomeLevel.includes('low') || incomeLevel.includes('poverty')) {
    if (approxAge >= 28) {
      parentScore += 5; // Still can have children, but less certainty
      dataPoints++;
    }
  }
  
  // ============================================
  // 3. TIME-BASED BEHAVIORAL PATTERNS (Key signals)
  // ============================================
  
  // WEEKDAY PATTERNS
  if (isWeekday) {
    // School hours browsing (9am-3pm) - parents with school-age kids have free time
    if (hour >= 9 && hour < 15) {
      if (approxAge >= 28 && approxAge <= 50) {
        parentScore += 12;
        reasoning.push('Weekday school-hours browsing suggests kids may be at school');
        dataPoints++;
      }
    }
    
    // After-school crunch time (3pm-6pm) - if browsing, less likely to have young kids
    if (hour >= 15 && hour < 18) {
      if (approxAge >= 28 && approxAge <= 45) {
        // Browsing during pickup/homework time might indicate no young kids
        // But could be at work, so neutral-ish
        if (behavioral.attention.tabSwitches > 8) {
          parentScore += 8; // Multitasking while managing kids
          reasoning.push('After-school hours with multitasking suggests managing children');
          dataPoints++;
        }
      }
    }
    
    // Evening "after bedtime" window (8pm-10:30pm) - CLASSIC parent signal
    if (hour >= 20 && (hour < 22 || (hour === 22 && minutes <= 30))) {
      if (approxAge >= 26 && approxAge <= 50) {
        parentScore += 18;
        reasoning.push('Weeknight 8-10:30pm browsing = classic "kids asleep" window');
        dataPoints++;
        
        // Even stronger if focused (finally got peace and quiet)
        if (behavioral.attention.tabSwitches < 3) {
          parentScore += 5;
          reasoning.push('Focused evening browsing suggests precious quiet time');
        }
      }
    }
    
    // Late evening (10:30pm-midnight) - less likely young kids
    if ((hour === 22 && minutes > 30) || hour === 23) {
      if (approxAge >= 30 && approxAge <= 50) {
        parentScore += 8; // Could have older kids
        reasoning.push('Late weeknight browsing - possible older children');
        dataPoints++;
      }
    }
    
    // Very early morning (5am-7am) - parents with young kids often up early
    if (hour >= 5 && hour < 7) {
      if (approxAge >= 26 && approxAge <= 45) {
        parentScore += 15;
        reasoning.push('Early weekday morning suggests young children waking early');
        dataPoints++;
      }
    }
    
    // Night owl hours on weekday (midnight-4am) - unlikely with young kids
    if (hour >= 0 && hour < 4) {
      if (approxAge >= 28 && approxAge <= 40) {
        parentScore -= 12;
        reasoning.push('Late weeknight hours unusual for parents of young children');
        dataPoints++;
      }
    }
  }
  
  // WEEKEND PATTERNS
  if (isWeekend) {
    // Early weekend morning (6am-9am) - parents with young kids don't sleep in
    if (hour >= 6 && hour < 9) {
      if (approxAge >= 26 && approxAge <= 45) {
        parentScore += 15;
        reasoning.push('Early weekend morning activity suggests young children');
        dataPoints++;
      }
    }
    
    // Late weekend morning (10am-noon) - could be sleeping in (no young kids) or activities
    if (hour >= 10 && hour < 12) {
      // Neutral - could go either way
      if (approxAge >= 30 && approxAge <= 50) {
        parentScore += 5;
        dataPoints++;
      }
    }
    
    // Weekend afternoon (1pm-5pm) - family activity time, less browsing if has kids
    if (hour >= 13 && hour < 17) {
      if (approxAge >= 28 && approxAge <= 50) {
        // Extended browsing on weekend afternoon = possibly no young kids
        if (behavioral.attention.focusTime > 300000) { // 5+ minutes focused
          parentScore -= 5;
          reasoning.push('Extended weekend afternoon browsing - possible no young kids');
          dataPoints++;
        } else if (behavioral.attention.tabSwitches > 5) {
          parentScore += 10;
          reasoning.push('Interrupted weekend browsing suggests child supervision');
          dataPoints++;
        }
      }
    }
    
    // Saturday evening (7pm-10pm) - parents often home with kids
    if (dayOfWeek === 6 && hour >= 19 && hour < 22) {
      if (approxAge >= 28 && approxAge <= 50 && !incomeLevel.includes('high')) {
        parentScore += 8;
        reasoning.push('Saturday evening home = possible family time');
        dataPoints++;
      }
    }
    
    // Late Saturday night (11pm+) - parents with young kids rarely out late
    if (dayOfWeek === 6 && hour >= 23) {
      if (approxAge >= 28 && approxAge <= 42) {
        parentScore -= 8;
        reasoning.push('Late Saturday night activity less common for young parents');
        dataPoints++;
      }
    }
  }
  
  // Friday evening special case - parents often home
  if (isFriday && hour >= 18 && hour < 22) {
    if (approxAge >= 28 && approxAge <= 50) {
      parentScore += 10;
      reasoning.push('Friday evening home browsing suggests family obligations');
      dataPoints++;
    }
  }
  
  // ============================================
  // 4. SEASONAL/SCHOOL CALENDAR SIGNALS
  // ============================================
  const isSummer = month >= 5 && month <= 7; // June-August
  const isSchoolTime = month >= 8 || month <= 4; // Sept-May
  
  if (isSummer && isWeekday && hour >= 9 && hour < 17) {
    if (approxAge >= 28 && approxAge <= 50) {
      // Less free time during summer suggests kids at home
      if (behavioral.attention.tabSwitches > 6) {
        parentScore += 10;
        reasoning.push('Summer weekday interrupted browsing suggests kids home from school');
        dataPoints++;
      }
    }
  }
  
  if (isSchoolTime && isWeekday && hour >= 9 && hour < 14) {
    if (approxAge >= 28 && approxAge <= 50) {
      // Free time during school hours
      parentScore += 8;
      reasoning.push('School-year daytime availability suggests school-age children');
      dataPoints++;
    }
  }
  
  // ============================================
  // 5. BEHAVIORAL SIGNALS
  // ============================================
  
  // Interrupted browsing patterns suggest someone with responsibilities
  if (behavioral.attention.tabSwitches > 10 && behavioral.attention.timesWentAFK > 2) {
    if (approxAge >= 25 && approxAge <= 50) {
      parentScore += 8;
      reasoning.push('Frequently interrupted browsing suggests caretaker responsibilities');
      dataPoints++;
    }
  }
  
  // Very short session times (under 2 minutes focus) suggest being busy
  if (behavioral.attention.focusTime < 120000 && behavioral.mouse.movements > 50) {
    if (approxAge >= 26 && approxAge <= 50) {
      parentScore += 5;
      reasoning.push('Brief, interrupted sessions suggest busy household');
      dataPoints++;
    }
  }
  
  // High stress indicators during "witching hour" (5pm-7pm) = parent signal
  if (hour >= 17 && hour < 19) {
    if (behavioral.emotions.rageClicks > 0 || behavioral.mouse.erraticMovements > 8) {
      if (approxAge >= 26 && approxAge <= 50) {
        parentScore += 10;
        reasoning.push('Stressed behavior during "witching hour" suggests parent managing dinner/kids');
        dataPoints++;
      }
    }
  }
  
  // Calm, extended browsing late at night = "finally got the kids to sleep" pattern
  if (hour >= 21 && hour <= 23 && isWeekday) {
    if (behavioral.attention.tabSwitches < 3 && behavioral.scroll.scrollEvents > 10) {
      if (approxAge >= 28 && approxAge <= 50) {
        parentScore += 12;
        reasoning.push('Calm late-evening reading suggests enjoying quiet post-bedtime');
        dataPoints++;
      }
    }
  }
  
  // ============================================
  // 6. DEVICE & HARDWARE SIGNALS
  // ============================================
  
  // Mobile device during daytime hours - multitasking parent
  if (hardware.touchSupport && hardware.maxTouchPoints >= 5) {
    if (isWeekday && hour >= 9 && hour < 18) {
      if (approxAge >= 26 && approxAge <= 50) {
        parentScore += 6;
        reasoning.push('Mobile device during day suggests on-the-go parent');
        dataPoints++;
      }
    }
  }
  
  // Low battery + not charging suggests busy/mobile lifestyle
  if (hardware.battery && hardware.battery.level < 0.3 && !hardware.battery.charging) {
    if (approxAge >= 26 && approxAge <= 50) {
      parentScore += 5;
      reasoning.push('Low battery suggests busy, not sitting at desk');
      dataPoints++;
    }
  }
  
  // iPad-like resolution = possible family device
  const isTablet = (hardware.screenWidth >= 768 && hardware.screenWidth <= 1366) && hardware.touchSupport;
  if (isTablet && approxAge >= 28 && approxAge <= 50) {
    parentScore += 8;
    reasoning.push('Tablet device common in households with children');
    dataPoints++;
  }
  
  // ============================================
  // 7. SOCIAL LOGIN SIGNALS
  // ============================================
  if (socialLogins) {
    // Facebook is heavily used by parents (school groups, family connections)
    if (socialLogins.facebook && approxAge >= 28) {
      parentScore += 12;
      reasoning.push('Facebook login - platform heavily used by parents for school/family');
      dataPoints++;
    }
    
    // Multiple social logins + prime age = socially connected (often parents)
    const loginCount = [socialLogins.google, socialLogins.facebook, socialLogins.twitter].filter(Boolean).length;
    if (loginCount >= 2 && approxAge >= 30 && approxAge <= 50) {
      parentScore += 6;
      reasoning.push('Multiple social accounts suggests family-connected user');
      dataPoints++;
    }
  }
  
  // ============================================
  // 8. LOCATION SIGNALS
  // ============================================
  if (network.city) {
    const city = network.city.toLowerCase();
    // Suburban-heavy cities tend to have more families
    const familyCities = [
      'austin', 'denver', 'phoenix', 'dallas', 'charlotte', 'raleigh', 'nashville',
      'san diego', 'portland', 'minneapolis', 'seattle suburbs', 'irvine', 'plano',
      'frisco', 'gilbert', 'scottsdale', 'cary', 'chandler', 'henderson'
    ];
    
    const youngSinglesCities = [
      'manhattan', 'san francisco', 'brooklyn', 'hoboken', 'west hollywood',
      'miami beach', 'las vegas strip'
    ];
    
    if (familyCities.some(fc => city.includes(fc))) {
      if (approxAge >= 28) {
        parentScore += 10;
        reasoning.push(`${network.city} is a family-friendly suburban area`);
        dataPoints++;
      }
    }
    
    if (youngSinglesCities.some(yc => city.includes(yc))) {
      if (approxAge < 40) {
        parentScore -= 8;
        reasoning.push(`${network.city} skews younger/single demographic`);
        dataPoints++;
      }
    }
  }
  
  // ============================================
  // 9. CALCULATE FINAL RESULT
  // ============================================
  
  // Normalize score to -100 to +100 range
  parentScore = Math.max(-100, Math.min(100, parentScore));
  
  // Calculate confidence based on data points
  const confidence = Math.min(30 + (dataPoints * 5), 85);
  
  // Determine status string
  let status: string;
  if (parentScore >= 50) {
    status = 'Very likely has children';
    if (approxAge >= 40) {
      status = 'Very likely has children (possibly teenagers)';
    } else if (approxAge < 35) {
      status = 'Very likely has young children';
    }
  } else if (parentScore >= 30) {
    status = 'Likely has children';
    if (hour >= 20 && hour <= 22 && isWeekday) {
      status = 'Likely has children (evening browsing pattern)';
    }
  } else if (parentScore >= 15) {
    status = 'Probably has children';
  } else if (parentScore >= 5) {
    status = 'Possibly has children';
  } else if (parentScore >= -10) {
    status = 'May or may not have children';
  } else if (parentScore >= -25) {
    status = 'Less likely to have children';
  } else if (parentScore >= -40) {
    status = 'Unlikely to have children';
  } else {
    status = 'Very unlikely to have children';
  }
  
  // Add time-specific context
  if (status.includes('Likely') || status.includes('Probably')) {
    if (hour >= 5 && hour < 7 && isWeekday) {
      status += ' (early riser with kids)';
    } else if (hour >= 20 && hour <= 22 && isWeekday) {
      status += ' (post-bedtime browser)';
    } else if (hour >= 6 && hour < 9 && isWeekend) {
      status += ' (no sleeping in with kids)';
    }
  }
  
  return { status, confidence, reasoning };
}

function guessPersonalLife(
  hardware: HardwareData,
  behavioral: BehavioralData,
  network: NetworkData,
  incomeLevel: string,
  ageRange: string,
  socialLogins?: SocialLogins
): PersonalLifeGuesses & { reasoning: string[] } {
  const reasoning: string[] = [];
  
  // Parse age range to get approximate age
  const ageMatch = ageRange.match(/(\d+)/);
  const approxAge = ageMatch ? parseInt(ageMatch[1]) : 30;
  
  // Use advanced parent prediction
  const parentResult = predictParentStatus(hardware, behavioral, network, incomeLevel, ageRange, socialLogins);
  const parent = parentResult.status;
  reasoning.push(...parentResult.reasoning.slice(0, 3)); // Add top 3 reasons
  
  // Pet owner - no reliable signals available
  // We can't actually detect this from browser data without speculation
  let petOwner = 'Unknown (no pet-related signals detected)';
  
  // Homeowner vs renter
  let homeowner: string;
  if (incomeLevel.includes('high') || incomeLevel.includes('wealthy')) {
    if (approxAge >= 32) {
      homeowner = 'Likely homeowner';
      reasoning.push('High income + age suggests homeownership');
    } else {
      homeowner = 'Renting or recently purchased';
    }
  } else if (incomeLevel.includes('upper-middle')) {
    homeowner = 'Possibly owns, likely renting';
  } else if (incomeLevel.includes('low') || incomeLevel.includes('poverty')) {
    homeowner = 'Renter';
  } else {
    homeowner = 'Likely renting';
  }
  
  // Car owner
  let carOwner: string;
  const city = network.city?.toLowerCase() || '';
  const urbanNoCarCities = ['new york', 'san francisco', 'boston', 'chicago', 'london', 'paris', 'tokyo', 'singapore', 'hong kong'];
  
  if (urbanNoCarCities.some(c => city.includes(c))) {
    if (incomeLevel.includes('high') || incomeLevel.includes('wealthy')) {
      carOwner = 'Possibly (urban but high income)';
    } else {
      carOwner = 'Likely no car (urban location)';
      reasoning.push(`${network.city} is a transit-friendly city`);
    }
  } else if (incomeLevel.includes('low') || incomeLevel.includes('poverty')) {
    carOwner = 'Unknown (may rely on public transit)';
  } else {
    carOwner = 'Likely owns a vehicle';
  }
  
  // Social type
  let socialType: string;
  if (behavioral.attention.tabSwitches > 10) {
    socialType = 'Social multitasker';
    reasoning.push('High tab switching suggests active social/communication habits');
  } else if (behavioral.attention.tabSwitches < 3 && behavioral.attention.focusTime > 60000) {
    socialType = 'Focused introvert';
  } else {
    socialType = 'Balanced';
  }
  
  return {
    parent,
    petOwner,
    homeowner,
    carOwner,
    socialType,
    reasoning,
  };
}

// ============================================
// CREEPY INSIGHTS GENERATOR
// ============================================

function generateCreepyInsightsInternal(
  hardware: HardwareData,
  network: NetworkData,
  browser: BrowserData,
  botDetection: BotDetectionData,
  behavioral: BehavioralData,
  cryptoWallets: CryptoWallets,
  trackingDetection: TrackingDetection,
  _userProfile: UserProfileFlags,
  ageRange: string,
  incomeEstimate: string,
  occupation: string,
  socialLogins?: SocialLogins
): string[] {
  const insights: string[] = [];
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Parse referrer for detailed analysis
  let referrerSource = 'direct';
  let referrerDetails = '';
  try {
    if (browser.referrer && browser.referrer !== 'Direct') {
      const url = new URL(browser.referrer);
      const params = url.searchParams;
      const searchQuery = params.get('q') || params.get('query') || params.get('p');
      
      if (searchQuery) {
        referrerDetails = searchQuery;
        referrerSource = 'search';
      }
      
      // Check for subreddit
      const subredditMatch = url.pathname.match(/\/r\/([^\/]+)/);
      if (subredditMatch) {
        referrerDetails = `r/${subredditMatch[1]}`;
        referrerSource = 'reddit';
      }
    }
  } catch {
    // fallback to basic analysis
  }
  
  // Referrer insight - where they came from (ENHANCED)
  const referrer = browser.referrer?.toLowerCase() || '';
  if (referrerSource === 'search' && referrerDetails) {
    insights.push(`Your search query "${referrerDetails}" brought you here. That single query reveals what's on your mind - and it's logged forever in your search history.`);
  } else if (referrerSource === 'reddit' && referrerDetails) {
    insights.push(`You clicked through from ${referrerDetails} - that subreddit choice alone tells us a lot about your interests, opinions, and likely political leanings.`);
  } else if (referrer.includes('reddit')) {
    insights.push(`You came here from Reddit - ${socialLogins?.reddit ? 'and we can see you\'re logged in. Your entire post/comment history is technically accessible.' : 'a Redditor clicking through links in your feed.'}`);
  } else if (referrer.includes('hackernews') || referrer.includes('ycombinator')) {
    insights.push(`Clicked through from Hacker News - you're part of the tech/startup crowd. Statistically, you likely have a CS degree and make $${parseInt(incomeEstimate.replace(/[^0-9]/g, '')) > 100 ? '150k+' : '80k+'}/year.`);
  } else if (referrer.includes('twitter') || referrer.includes('x.com')) {
    insights.push(`Found this via Twitter/X - ${socialLogins?.twitter ? 'logged into your account' : 'scrolling your timeline'} when something caught your eye. Your follow list would reveal your exact worldview.`);
  } else if (referrer.includes('google')) {
    insights.push(`Google search brought you here - Google knows every search you've ever made. They've built a profile more accurate than we can from just this visit.`);
  } else if (referrer.includes('linkedin')) {
    insights.push(`Came from LinkedIn - ${hour >= 9 && hour <= 17 && !isWeekend ? 'networking during work hours (we see you)' : 'job hunting or personal branding'}. Your entire career history is one API call away.`);
  } else if (referrer.includes('tiktok')) {
    insights.push(`TikTok brought you here - that algorithm knows your attention span, interests, and emotional triggers better than you do.`);
  } else if (!browser.referrer || browser.referrer === 'Direct') {
    insights.push(`Direct visit with no referrer - you either typed the URL, used a bookmark, or your browser/VPN is hiding where you came from. Privacy-conscious... or have something to hide?`);
  }
  
  // Social login insights
  if (socialLogins) {
    const services = [];
    if (socialLogins.google) services.push('Google');
    if (socialLogins.facebook) services.push('Facebook');
    if (socialLogins.twitter) services.push('Twitter');
    if (socialLogins.github) services.push('GitHub');
    if (socialLogins.reddit) services.push('Reddit');
    
    if (services.length >= 3) {
      insights.push(`You're logged into ${services.length} services (${services.join(', ')}) - your entire online identity is mapped and connected.`);
    } else if (socialLogins.github && socialLogins.google) {
      insights.push(`GitHub AND Google logged in - definitely a developer. Probably using Chrome synced across all your devices too.`);
    } else if (socialLogins.github) {
      insights.push(`GitHub login detected - we know you're a developer. Your public repos, contribution history, coding languages - all visible.`);
    } else if (socialLogins.facebook && !socialLogins.twitter && !socialLogins.reddit) {
      insights.push(`Only logged into Facebook - statistically, this puts you in the 35+ age bracket. The younger crowd moved elsewhere.`);
    } else if (socialLogins.reddit) {
      insights.push(`Reddit login detected - you're deep in internet culture. What subreddits define you? We could probably guess.`);
    }
  }
  
  // Time-based insight (ENHANCED)
  const hourStr = hour < 12 ? `${hour === 0 ? 12 : hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;
  const timeContext = (() => {
    if (hour >= 1 && hour < 5) {
      if (socialLogins?.github || botDetection.devToolsOpen) {
        return 'deep in a coding session at ${hourStr}. This is either passion or a deadline. Either way, your sleep schedule is compromised.';
      }
      return 'browsing at ${hourStr}? That suggests insomnia, anxiety, or a timezone mismatch. If you\'re actually in ' + (network.city || 'your timezone') + ', you might want to see a sleep specialist.';
    }
    if (hour >= 5 && hour < 7) {
      return 'up before most people\'s alarms. Either you have kids, you\'re a morning gym person, or you\'re in a different timezone than your IP suggests.';
    }
    if (hour >= 9 && hour < 17 && !isWeekend) {
      return 'browsing during standard work hours. Your employer probably tracks this too, by the way.';
    }
    if (hour >= 20 && hour <= 22 && !isWeekend) {
      return 'weeknight 8-10pm is the classic "finally got some peace" browsing window. Kids in bed? Partner watching TV?';
    }
    if (isWeekend && hour >= 10 && hour < 12) {
      return 'weekend late morning - either you slept in (no kids) or you\'ve been up for hours already (definitely kids).';
    }
    if (isWeekend && hour >= 13 && hour < 17) {
      return `${dayNames[dayOfWeek]} afternoon browsing instead of being outside. We don't judge, but your fitness tracker might.`;
    }
    if (hour >= 22) {
      return 'late night scrolling. Blue light before bed is killing your sleep quality, but you know that already.';
    }
    return 'fairly normal browsing hours. But normal is just a statistical average - nothing about you is "normal" to an algorithm.';
  })();
  
  insights.push(
    `It's ${hourStr} on ${dayNames[dayOfWeek]}${network.city ? ` in ${network.city}` : ''} - you're ${timeContext.replace('${hourStr}', hourStr)}`
  );
  
  // Hardware insight
  const gpuInfo = getGPUInfo(hardware.gpu);
  if (gpuInfo && gpuInfo.tier === 'premium') {
    insights.push(
      `Your ${hardware.gpu?.split(' ').slice(0, 3).join(' ')} GPU tells us you either game seriously, do creative work, or just like having the best - either way, you had $${gpuInfo.msrp}+ to spend on graphics alone.`
    );
  } else if (gpuInfo && gpuInfo.tier === 'high') {
    insights.push(
      `A ${hardware.gpu?.split(' ').slice(0, 3).join(' ')} is solid hardware - you're not cutting corners, but you're not showing off either. Practical enthusiast.`
    );
  } else if (hardware.gpu?.toLowerCase().includes('intel') || hardware.gpu?.toLowerCase().includes('uhd')) {
    insights.push(
      `Integrated graphics (${hardware.gpu?.split(' ').slice(0, 3).join(' ')}) - you're either using a work laptop, prioritize portability over power, or gaming just isn't your thing.`
    );
  }
  
  // Screen resolution insight
  if (hardware.screenWidth >= 3840) {
    insights.push(
      `Your ${hardware.screenWidth}x${hardware.screenHeight} resolution at ${hardware.pixelRatio}x pixel density means you're staring at a seriously high-end display - your eyes thank you, but your wallet probably didn't.`
    );
  } else if (hardware.screenWidth === 1366 && hardware.screenHeight === 768) {
    insights.push(
      `1366x768 - the classic budget laptop resolution. You're either cost-conscious, using an older machine, or this is a work-issued computer you didn't choose.`
    );
  }
  
  // Behavioral insight
  if (behavioral.mouse.rageClicks > 2) {
    insights.push(
      `We detected ${behavioral.mouse.rageClicks} rage clicks - something frustrated you. Slow website? Confusing interface? Or just having a rough day?`
    );
  } else if (behavioral.mouse.erraticMovements > 15) {
    insights.push(
      `Your mouse movement is... chaotic. ${behavioral.mouse.erraticMovements} erratic movements suggest either a bad mousepad, caffeine overdose, or you're searching for something you can't find.`
    );
  } else if (behavioral.mouse.totalClicks < 3 && behavioral.mouse.movements > 500) {
    insights.push(
      `Lots of mouse movement but barely any clicks - you're reading carefully, possibly skeptical, definitely thorough. Or you're a bot. But we already checked that.`
    );
  }
  
  // Privacy insight
  if (trackingDetection.adBlocker && cryptoWallets.hasAnyWallet) {
    insights.push(
      `Ad blocker active AND a crypto wallet installed - you care about privacy and financial sovereignty, yet here you are, willingly exposing all this data. The irony isn't lost on us.`
    );
  } else if (trackingDetection.adBlocker) {
    insights.push(
      `You use an ad blocker (smart), but that didn't stop us from fingerprinting your browser. Privacy is harder than installing an extension.`
    );
  } else if (!trackingDetection.adBlocker && !trackingDetection.doNotTrack) {
    insights.push(
      `No ad blocker, Do Not Track disabled - you're either blissfully unaware of tracking, or you've accepted being the product. Every site you visit knows more about you than you realize.`
    );
  }
  
  // Crypto insight
  if (cryptoWallets.phantom && cryptoWallets.metamask) {
    insights.push(
      `Both Phantom (Solana) and MetaMask (Ethereum) wallets - you're diversified across ecosystems. Either you're hedging bets or you got into crypto during different hype cycles.`
    );
  } else if (cryptoWallets.phantom) {
    insights.push(
      `Phantom wallet detected - a Solana believer. You probably got in after hearing about an NFT drop, or you genuinely care about transaction speeds. Either way, you've felt the pain of a wallet drain attempt at least once.`
    );
  } else if (cryptoWallets.metamask) {
    insights.push(
      `MetaMask installed - the gateway drug to DeFi. You've probably approved at least one sketchy contract, spent way too much on gas, and still don't fully understand how to revoke token approvals.`
    );
  }
  
  // Battery insight
  if (hardware.battery) {
    if (hardware.battery.level < 0.15 && !hardware.battery.charging) {
      insights.push(
        `Your battery is at ${Math.round(hardware.battery.level * 100)}% and you're NOT charging - you're either living dangerously, far from an outlet, or about to learn a hard lesson about saving your work.`
      );
    } else if (hardware.battery.level > 0.95 && hardware.battery.charging) {
      insights.push(
        `Battery at ${Math.round(hardware.battery.level * 100)}% and still plugged in - stationed at your desk. This is probably your primary work spot.`
      );
    }
  }
  
  // ISP/Location insight
  if (network.isp) {
    const ispTier = getISPTier(network.isp);
    if (ispTier === 'datacenter') {
      insights.push(
        `Your IP resolves to a datacenter (${network.isp}) - you're using a VPN, proxy, or accessing from a cloud instance. Trying to hide something, or just security-conscious?`
      );
    } else if (ispTier === 'enterprise') {
      insights.push(
        `Enterprise-grade internet from ${network.isp} - you're either at a corporate office, or you're important enough to have business-class internet at home.`
      );
    }
  }
  
  // Attention span insight
  if (behavioral.attention.tabSwitches > 15) {
    insights.push(
      `${behavioral.attention.tabSwitches} tab switches in this session - your attention span is fighting a losing battle. Too many browser tabs, too many thoughts, too little dopamine.`
    );
  }
  
  // DevTools insight
  if (botDetection.devToolsOpen) {
    insights.push(
      `We see you have DevTools open - fellow developer, or just curious how we're watching you? Either way, you're now part of the ~2% of users who actually look under the hood.`
    );
  }
  
  // Final creepy summary
  if (insights.length < 5) {
    insights.push(
      `Based on your ${hardware.cpuCores || 'unknown'}-core CPU, ${network.city || 'unknown'} location, and browsing patterns, we estimate you're a ${ageRange} year old ${occupation.toLowerCase()} earning ${incomeEstimate}. Creepy? This is what every website could know about you.`
    );
  }
  
  return insights.slice(0, 5);
}

// ============================================
// MAIN EXPORT FUNCTIONS
// ============================================

export function generateAIAnalysis(
  hardware: HardwareData,
  network: NetworkData,
  browser: BrowserData,
  botDetection: BotDetectionData,
  behavioral: BehavioralData,
  cryptoWallets: CryptoWallets,
  trackingDetection: TrackingDetection,
  socialLogins?: SocialLogins,
  vpnDetection?: VPNDetection
): AIAnalysis {
  // Get device analysis
  const deviceAnalysis = estimateDeviceValue(hardware, browser);
  
  // Get age prediction with social login data
  const ageResult = predictAgeRangeEnhanced(hardware, browser, behavioral, network, botDetection, cryptoWallets, trackingDetection, socialLogins);
  
  // Get income prediction
  const incomeResult = predictIncomeLevel(hardware, network, browser, trackingDetection);
  
  // Get occupation prediction with social login data
  const occupationResult = predictOccupationEnhanced(hardware, browser, behavioral, cryptoWallets, trackingDetection, botDetection, socialLogins);
  
  // Calculate Human Score (0-100)
  let humanScore = 100;
  if (botDetection.isAutomated) humanScore -= 40;
  if (botDetection.isHeadless) humanScore -= 30;
  if (botDetection.zeroMetrics) humanScore -= 20;
  if (behavioral.mouse.totalClicks > 5) humanScore += 5;
  if (behavioral.mouse.movements > 100) humanScore += 5;
  if (behavioral.typing.totalKeystrokes > 10) humanScore += 5;
  if (behavioral.scroll.scrollEvents > 5) humanScore += 5;
  // Social login signals - logged in users are more likely human
  if (socialLogins?.google || socialLogins?.facebook) humanScore += 5;
  humanScore = Math.max(0, Math.min(100, humanScore));
  
  // Calculate Fraud Risk (0-100)
  let fraudRisk = 0;
  if (botDetection.isAutomated) fraudRisk += 30;
  if (botDetection.isHeadless) fraudRisk += 25;
  if (botDetection.zeroMetrics) fraudRisk += 15;
  if (botDetection.isVirtualMachine) fraudRisk += 10;
  if (trackingDetection.adBlocker) fraudRisk += 5;
  if (!network.country) fraudRisk += 5;
  // VPN usage increases fraud risk slightly
  if (vpnDetection?.likelyUsingVPN) fraudRisk += 5;
  if (vpnDetection?.timezoneMismatch) fraudRisk += 5;
  fraudRisk = Math.min(100, fraudRisk);
  
  // Determine work style based on multiple signals
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  let workStyle: string;
  // GitHub users are more likely to work flexible/remote
  if (socialLogins?.github && botDetection.devToolsOpen) {
    workStyle = 'Remote developer, flexible hours';
  } else if (hour >= 9 && hour <= 17 && !isWeekend) {
    workStyle = 'Standard 9-5';
  } else if (hour >= 22 || hour < 6) {
    workStyle = 'Night owl / Irregular hours';
  } else if (isWeekend && hour >= 9 && hour <= 17) {
    workStyle = 'Weekend worker';
  } else {
    workStyle = 'Flexible schedule';
  }
  
  // Life situation based on multiple signals
  let lifeSituation = '';
  if (network.city) {
    const col = getCostOfLivingMultiplier(network.city);
    if (col > 1.4) {
      lifeSituation = `${network.city} (high cost of living)`;
    } else {
      lifeSituation = `${network.city} area`;
    }
  }
  if (incomeResult.level === 'high' || incomeResult.level === 'wealthy') {
    lifeSituation += lifeSituation ? ', comfortable lifestyle' : 'Comfortable lifestyle';
  }
  // VPN users might be privacy conscious or accessing from different location
  if (vpnDetection?.likelyUsingVPN) {
    lifeSituation += lifeSituation ? ' (possibly remote/traveling)' : 'Location obscured (VPN)';
  }
  
  return {
    humanScore,
    fraudRisk,
    deviceTier: deviceAnalysis.tier,
    deviceValue: deviceAnalysis.value,
    deviceAge: deviceAnalysis.age,
    incomeLevel: incomeResult.level === 'wealthy' ? 'high' : incomeResult.level === 'poverty' ? 'low' : incomeResult.level.includes('middle') ? 'medium' : incomeResult.level as 'low' | 'medium' | 'high' | 'unknown',
    ageRange: ageResult.range,
    occupation: occupationResult.occupation,
    education: occupationResult.education,
    workStyle,
    lifeSituation: lifeSituation || 'Unknown',
  };
}

// Enhanced age prediction using social login signals
function predictAgeRangeEnhanced(
  hardware: HardwareData,
  browser: BrowserData,
  behavioral: BehavioralData,
  network: NetworkData,
  botDetection: BotDetectionData,
  cryptoWallets: CryptoWallets,
  trackingDetection: TrackingDetection,
  socialLogins?: SocialLogins
): { range: string; reasoning: string[] } {
  // Start with base prediction
  const baseResult = predictAgeRange(hardware, browser, behavioral, network, botDetection, cryptoWallets, trackingDetection);
  const reasoning = [...baseResult.reasoning];
  
  // Parse base range
  const parts = baseResult.range.split('-').map(p => parseInt(p.trim()));
  let minAge = parts[0] || 25;
  let maxAge = parts[1] || 35;
  
  // Social login signals
  if (socialLogins) {
    // Facebook without other platforms suggests older user
    if (socialLogins.facebook && !socialLogins.twitter && !socialLogins.reddit && !socialLogins.github) {
      minAge += 5;
      maxAge += 5;
      reasoning.push('Facebook-only user suggests older demographic (35+)');
    }
    
    // GitHub users tend to be 22-40
    if (socialLogins.github) {
      minAge = Math.max(minAge, 22);
      maxAge = Math.min(maxAge, 42);
      reasoning.push('GitHub user suggests developer age range (22-42)');
    }
    
    // Reddit + Twitter + no Facebook suggests younger
    if ((socialLogins.reddit || socialLogins.twitter) && !socialLogins.facebook) {
      minAge = Math.max(18, minAge - 3);
      maxAge = Math.min(35, maxAge);
      reasoning.push('Reddit/Twitter without Facebook suggests younger demographic');
    }
    
    // Multiple social logins = active online presence
    const loginCount = [socialLogins.google, socialLogins.facebook, socialLogins.twitter, socialLogins.github, socialLogins.reddit].filter(Boolean).length;
    if (loginCount >= 3) {
      reasoning.push(`Very active online presence (${loginCount} platforms)`);
    }
  }
  
  // Referrer signals
  if (browser.referrer) {
    const ref = browser.referrer.toLowerCase();
    if (ref.includes('reddit') || ref.includes('hackernews') || ref.includes('ycombinator')) {
      minAge = Math.max(minAge, 22);
      maxAge = Math.min(maxAge, 38);
      reasoning.push('Came from tech community (Reddit/HN)');
    }
    if (ref.includes('facebook')) {
      minAge = Math.max(minAge, 28);
      reasoning.push('Came from Facebook - skews older');
    }
    if (ref.includes('tiktok')) {
      minAge = Math.max(16, minAge - 5);
      maxAge = Math.min(maxAge, 30);
      reasoning.push('Came from TikTok - younger demographic');
    }
  }
  
  // Session history length (tab navigation depth only)
  if (browser.historyLength > 50) {
    reasoning.push('Deep session navigation in this tab');
  } else if (browser.historyLength === 1) {
    reasoning.push('Fresh tab session');
  }
  
  // Ensure valid range
  minAge = Math.max(16, minAge);
  maxAge = Math.max(minAge + 3, maxAge);
  
  return {
    range: `${minAge}-${maxAge}`,
    reasoning
  };
}

// Enhanced occupation prediction using social logins and more signals
function predictOccupationEnhanced(
  hardware: HardwareData,
  _browser: BrowserData,
  behavioral: BehavioralData,
  cryptoWallets: CryptoWallets,
  trackingDetection: TrackingDetection,
  botDetection: BotDetectionData,
  socialLogins?: SocialLogins
): { occupation: string; education: string } {
  const gpu = hardware.gpu?.toLowerCase() || '';
  const isAppleSilicon = ['m1', 'm2', 'm3'].some(m => gpu.includes(m));
  const isGamingGPU = ['rtx', 'gtx', 'radeon', 'rx '].some(g => gpu.includes(g));
  const hasDevTools = botDetection.devToolsOpen;
  const hasAdBlocker = trackingDetection.adBlocker;
  const hasCrypto = cryptoWallets.hasAnyWallet;
  const fastTypist = behavioral.typing.averageWPM > 60;
  
  // Strong developer signals
  if (socialLogins?.github && hasDevTools) {
    if (isAppleSilicon && hardware.screenWidth >= 2560) {
      return { occupation: 'Senior Software Engineer', education: 'BS/MS Computer Science' };
    }
    if (isGamingGPU && (hardware.ram || 0) >= 32) {
      return { occupation: 'Full-Stack Developer', education: 'Computer Science degree' };
    }
    return { occupation: 'Software Developer', education: 'Tech-related degree' };
  }
  
  // GitHub but no devtools - could be PM or designer
  if (socialLogins?.github && !hasDevTools) {
    if (isAppleSilicon) {
      return { occupation: 'Product Manager / Tech PM', education: "Bachelor's degree" };
    }
    return { occupation: 'Technical Writer or PM', education: "Bachelor's degree" };
  }
  
  // DevTools open but no GitHub - learning or hobbyist
  if (hasDevTools && !socialLogins?.github) {
    if (fastTypist) {
      return { occupation: 'Junior Developer / Bootcamp grad', education: 'Coding bootcamp' };
    }
    return { occupation: 'Tech hobbyist / Learning to code', education: 'Self-taught' };
  }
  
  // Crypto signals
  if (hasCrypto) {
    const walletCount = [cryptoWallets.metamask, cryptoWallets.phantom, cryptoWallets.coinbase, 
                        cryptoWallets.braveWallet, cryptoWallets.trustWallet].filter(Boolean).length;
    if (walletCount >= 2 && hasDevTools) {
      return { occupation: 'Web3/DeFi Developer', education: 'Computer Science or self-taught' };
    }
    if (walletCount >= 2) {
      return { occupation: 'Crypto Trader / DeFi User', education: 'Finance or tech background' };
    }
    return { occupation: 'Crypto enthusiast', education: 'Various' };
  }
  
  // Reddit user signals
  if (socialLogins?.reddit) {
    if (hasAdBlocker && fastTypist) {
      return { occupation: 'Tech industry professional', education: "Bachelor's degree" };
    }
    return { occupation: 'Knowledge worker', education: 'College educated' };
  }
  
  // Apple Silicon users
  if (isAppleSilicon) {
    if (hardware.screenWidth >= 2560) {
      return { occupation: 'Creative professional / Designer', education: 'Design or related degree' };
    }
    return { occupation: 'Professional / Business user', education: "Bachelor's degree" };
  }
  
  // Gaming GPU users
  if (isGamingGPU) {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 8) {
      return { occupation: 'Gamer / Content creator', education: 'Various' };
    }
    return { occupation: 'Tech enthusiast / IT professional', education: 'Tech education' };
  }
  
  // High specs but no specific signals
  if ((hardware.cpuCores || 0) >= 12 && (hardware.ram || 0) >= 32) {
    return { occupation: 'Power user / Technical professional', education: 'Technical degree' };
  }
  
  // Default based on time and behavior
  const hour = new Date().getHours();
  const isWorkHours = hour >= 9 && hour <= 17;
  const isWeekday = new Date().getDay() >= 1 && new Date().getDay() <= 5;
  
  if (isWorkHours && isWeekday) {
    return { occupation: 'Office worker', education: 'College educated' };
  }
  
  return { occupation: 'General consumer', education: 'Unknown' };
}

export function generatePersonalLifeGuesses(
  hardware: HardwareData,
  behavioral: BehavioralData,
  aiAnalysis: AIAnalysis,
  network?: NetworkData,
  socialLogins?: SocialLogins
): PersonalLifeGuesses {
  // Use provided network data or fallback to empty
  const networkData = network || { 
    city: null, region: null, country: null, countryCode: null, 
    ip: null, isp: null, latitude: null, longitude: null, 
    timezone: null, loading: false, error: null, connectionType: null, 
    downlink: null, rtt: null, dataSaver: false, webrtcSupported: false, 
    webrtcLocalIPs: [] 
  };
  
  const result = guessPersonalLife(
    hardware,
    behavioral,
    networkData,
    aiAnalysis.incomeLevel,
    aiAnalysis.ageRange,
    socialLogins
  );
  
  return {
    parent: result.parent,
    petOwner: result.petOwner,
    homeowner: result.homeowner,
    carOwner: result.carOwner,
    socialType: result.socialType,
  };
}

export function generateMentalPhysicalState(
  behavioral: BehavioralData,
  hardware: HardwareData
): MentalPhysicalState {
  const result = analyzeMentalState(
    behavioral,
    hardware,
    { city: null, region: null, country: null, countryCode: null, ip: null, isp: null, latitude: null, longitude: null, timezone: null, loading: false, error: null, connectionType: null, downlink: null, rtt: null, dataSaver: false, webrtcSupported: false, webrtcLocalIPs: [] }
  );
  
  return {
    stressLevel: result.stressLevel,
    sleepSchedule: result.sleepSchedule,
    fitnessLevel: result.fitnessLevel,
    healthConscious: result.healthConscious,
  };
}

// Regional data for lifestyle predictions
const REGIONAL_LIFESTYLE_DATA: Record<string, { 
  smokingRate: number;  // 0-100 percentage
  alcoholCulture: 'low' | 'moderate' | 'high';
  coffeeCulture: 'low' | 'moderate' | 'high';
}> = {
  // High smoking regions
  'China': { smokingRate: 26, alcoholCulture: 'moderate', coffeeCulture: 'low' },
  'Indonesia': { smokingRate: 33, alcoholCulture: 'low', coffeeCulture: 'moderate' },
  'Russia': { smokingRate: 28, alcoholCulture: 'high', coffeeCulture: 'moderate' },
  'Japan': { smokingRate: 17, alcoholCulture: 'high', coffeeCulture: 'high' },
  'Germany': { smokingRate: 23, alcoholCulture: 'high', coffeeCulture: 'high' },
  'France': { smokingRate: 25, alcoholCulture: 'high', coffeeCulture: 'high' },
  'Spain': { smokingRate: 22, alcoholCulture: 'high', coffeeCulture: 'high' },
  'Italy': { smokingRate: 20, alcoholCulture: 'high', coffeeCulture: 'high' },
  'Greece': { smokingRate: 27, alcoholCulture: 'high', coffeeCulture: 'high' },
  'Turkey': { smokingRate: 28, alcoholCulture: 'low', coffeeCulture: 'high' },
  'Poland': { smokingRate: 23, alcoholCulture: 'high', coffeeCulture: 'moderate' },
  'South Korea': { smokingRate: 19, alcoholCulture: 'high', coffeeCulture: 'high' },
  
  // Lower smoking regions
  'United States': { smokingRate: 11, alcoholCulture: 'moderate', coffeeCulture: 'high' },
  'United Kingdom': { smokingRate: 13, alcoholCulture: 'high', coffeeCulture: 'high' },
  'Canada': { smokingRate: 10, alcoholCulture: 'moderate', coffeeCulture: 'high' },
  'Australia': { smokingRate: 11, alcoholCulture: 'high', coffeeCulture: 'high' },
  'Sweden': { smokingRate: 7, alcoholCulture: 'moderate', coffeeCulture: 'high' },
  'Norway': { smokingRate: 9, alcoholCulture: 'moderate', coffeeCulture: 'high' },
  'Finland': { smokingRate: 12, alcoholCulture: 'moderate', coffeeCulture: 'high' },
  'Netherlands': { smokingRate: 17, alcoholCulture: 'high', coffeeCulture: 'high' },
  'Brazil': { smokingRate: 10, alcoholCulture: 'high', coffeeCulture: 'high' },
  'India': { smokingRate: 10, alcoholCulture: 'low', coffeeCulture: 'moderate' },
  'Singapore': { smokingRate: 10, alcoholCulture: 'moderate', coffeeCulture: 'high' },
  'New Zealand': { smokingRate: 9, alcoholCulture: 'high', coffeeCulture: 'high' },
  
  // Very low alcohol regions
  'Saudi Arabia': { smokingRate: 12, alcoholCulture: 'low', coffeeCulture: 'high' },
  'UAE': { smokingRate: 15, alcoholCulture: 'low', coffeeCulture: 'high' },
  'Iran': { smokingRate: 12, alcoholCulture: 'low', coffeeCulture: 'high' },
  'Pakistan': { smokingRate: 12, alcoholCulture: 'low', coffeeCulture: 'moderate' },
  'Bangladesh': { smokingRate: 18, alcoholCulture: 'low', coffeeCulture: 'low' },
};

// Age-based lifestyle probability adjustments
const AGE_LIFESTYLE_FACTORS = {
  caffeine: {
    '18-24': { base: 60, energyDrinks: true, coffee: 'moderate' },
    '25-34': { base: 75, energyDrinks: true, coffee: 'high' },
    '35-44': { base: 80, energyDrinks: false, coffee: 'high' },
    '45-54': { base: 75, energyDrinks: false, coffee: 'high' },
    '55-64': { base: 65, energyDrinks: false, coffee: 'moderate' },
    '65+': { base: 50, energyDrinks: false, coffee: 'moderate' },
  },
  alcohol: {
    '18-24': { base: 55, pattern: 'binge' },
    '25-34': { base: 65, pattern: 'social' },
    '35-44': { base: 60, pattern: 'moderate' },
    '45-54': { base: 55, pattern: 'moderate' },
    '55-64': { base: 50, pattern: 'wine' },
    '65+': { base: 40, pattern: 'occasional' },
  },
  smoking: {
    '18-24': { multiplier: 0.6 }, // Gen Z smokes much less
    '25-34': { multiplier: 0.8 },
    '35-44': { multiplier: 1.0 },
    '45-54': { multiplier: 1.2 },
    '55-64': { multiplier: 1.1 },
    '65+': { multiplier: 0.9 },
  },
};

export function generateLifestyleHabits(
  aiAnalysis: AIAnalysis,
  behavioral: BehavioralData,
  network?: NetworkData,
  browser?: BrowserData,
  userProfile?: UserProfileFlags
): LifestyleHabits {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isEvening = hour >= 18 && hour < 23;
  const isFriday = dayOfWeek === 5;
  
  // Get regional data
  const country = network?.country || '';
  const regionalData = REGIONAL_LIFESTYLE_DATA[country] || {
    smokingRate: 15, // Global average
    alcoholCulture: 'moderate' as const,
    coffeeCulture: 'moderate' as const,
  };
  
  // Parse age from aiAnalysis
  const ageStr = aiAnalysis.ageRange || '25-34';
  const ageKey = ageStr as keyof typeof AGE_LIFESTYLE_FACTORS.caffeine;
  const ageFactors = {
    caffeine: AGE_LIFESTYLE_FACTORS.caffeine[ageKey] || AGE_LIFESTYLE_FACTORS.caffeine['25-34'],
    alcohol: AGE_LIFESTYLE_FACTORS.alcohol[ageKey] || AGE_LIFESTYLE_FACTORS.alcohol['25-34'],
    smoking: AGE_LIFESTYLE_FACTORS.smoking[ageKey] || AGE_LIFESTYLE_FACTORS.smoking['35-44'],
  };
  
  // ============================================
  // CAFFEINE PREDICTION
  // ============================================
  let caffeineScore = ageFactors.caffeine.base;
  const caffeineSignals: string[] = [];
  
  // Time-based signals
  if (hour >= 5 && hour < 8) {
    caffeineScore += 15;
    caffeineSignals.push('early morning browsing');
  } else if (hour >= 22 || hour < 4) {
    caffeineScore += 20;
    caffeineSignals.push('late night activity');
  } else if (hour >= 14 && hour < 16) {
    caffeineScore += 10;
    caffeineSignals.push('afternoon slump time');
  }
  
  // Occupation-based signals
  const occupation = aiAnalysis.occupation?.toLowerCase() || '';
  if (occupation.includes('developer') || occupation.includes('engineer') || occupation.includes('programmer')) {
    caffeineScore += 25;
    caffeineSignals.push('tech worker (high caffeine industry)');
  } else if (occupation.includes('student')) {
    caffeineScore += 15;
    caffeineSignals.push('student lifestyle');
  } else if (occupation.includes('healthcare') || occupation.includes('nurse') || occupation.includes('doctor')) {
    caffeineScore += 20;
    caffeineSignals.push('healthcare (shift work)');
  } else if (occupation.includes('creative') || occupation.includes('designer') || occupation.includes('writer')) {
    caffeineScore += 15;
    caffeineSignals.push('creative profession');
  }
  
  // Behavioral signals
  if (behavioral.typing.averageWPM > 70) {
    caffeineScore += 10;
    caffeineSignals.push('fast typing speed');
  }
  if (behavioral.mouse.erraticMovements > 10) {
    caffeineScore += 5;
    caffeineSignals.push('jittery mouse movements');
  }
  if (userProfile?.developer?.detected) {
    caffeineScore += 15;
    caffeineSignals.push('developer profile');
  }
  
  // Regional culture
  if (regionalData.coffeeCulture === 'high') {
    caffeineScore += 10;
    caffeineSignals.push(`${country || 'region'} has high coffee culture`);
  }
  
  // Clamp and format
  caffeineScore = Math.min(95, Math.max(10, caffeineScore));
  
  let caffeine: string;
  if (caffeineScore >= 75) {
    caffeine = `Highly likely (${caffeineSignals.slice(0, 2).join(', ')})`;
  } else if (caffeineScore >= 55) {
    caffeine = `Likely (${caffeineSignals[0] || 'statistical average'})`;
  } else if (caffeineScore >= 35) {
    caffeine = 'Moderate consumption likely';
  } else {
    caffeine = 'Lower than average consumption';
  }
  
  // ============================================
  // ALCOHOL PREDICTION
  // ============================================
  let alcoholScore = ageFactors.alcohol.base;
  const alcoholSignals: string[] = [];
  
  // Regional culture (strongest signal)
  if (regionalData.alcoholCulture === 'high') {
    alcoholScore += 15;
    alcoholSignals.push(`${country || 'region'} drinking culture`);
  } else if (regionalData.alcoholCulture === 'low') {
    alcoholScore -= 30;
    alcoholSignals.push(`${country || 'region'} low alcohol culture`);
  }
  
  // Time-based signals
  if (isWeekend && isEvening) {
    alcoholScore += 15;
    alcoholSignals.push('weekend evening');
  } else if (isFriday && hour >= 17) {
    alcoholScore += 20;
    alcoholSignals.push('Friday happy hour time');
  } else if (hour >= 21 && hour <= 23 && !isWeekend) {
    alcoholScore += 5;
    alcoholSignals.push('weeknight wind-down');
  }
  
  // Income correlation (moderate drinkers tend to be higher income)
  if (aiAnalysis.incomeLevel === 'high') {
    alcoholScore += 10;
    alcoholSignals.push('higher income (social drinking)');
  } else if (aiAnalysis.incomeLevel === 'low') {
    alcoholScore -= 5;
  }
  
  // Social indicators
  const referrer = browser?.referrer?.toLowerCase() || '';
  if (referrer.includes('facebook') || referrer.includes('instagram')) {
    alcoholScore += 5;
    alcoholSignals.push('social media active');
  }
  
  // Work-life balance indicators
  if (hour >= 9 && hour <= 17 && !isWeekend) {
    alcoholScore -= 5; // Working hours = not drinking
  }
  
  // Clamp
  alcoholScore = Math.min(85, Math.max(5, alcoholScore));
  
  let drinksAlcohol: string;
  if (regionalData.alcoholCulture === 'low') {
    drinksAlcohol = `Unlikely (${country || 'regional'} cultural factors)`;
  } else if (alcoholScore >= 70) {
    drinksAlcohol = `Likely social drinker (${alcoholSignals[0] || ageFactors.alcohol.pattern})`;
  } else if (alcoholScore >= 50) {
    drinksAlcohol = `Possibly (${alcoholSignals[0] || 'moderate probability'})`;
  } else if (alcoholScore >= 30) {
    drinksAlcohol = 'Occasional at most';
  } else {
    drinksAlcohol = 'Unlikely or very light';
  }
  
  // ============================================
  // SMOKING PREDICTION
  // ============================================
  // This is the hardest to predict - use statistical correlations
  let smokingScore = regionalData.smokingRate * ageFactors.smoking.multiplier;
  const smokingSignals: string[] = [];
  
  // Education/Income inverse correlation (in developed countries)
  const developedCountries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Japan', 'South Korea', 'Netherlands', 'Sweden', 'Norway', 'Finland', 'Singapore'];
  const isDeveloped = developedCountries.includes(country);
  
  if (isDeveloped) {
    if (aiAnalysis.incomeLevel === 'high') {
      smokingScore *= 0.5;
      smokingSignals.push('high income (lower smoking rates)');
    } else if (aiAnalysis.incomeLevel === 'low') {
      smokingScore *= 1.4;
      smokingSignals.push('income correlation');
    }
    
    // Education proxy from occupation
    if (occupation.includes('doctor') || occupation.includes('healthcare') || 
        occupation.includes('professor') || occupation.includes('researcher')) {
      smokingScore *= 0.4;
      smokingSignals.push('health-aware profession');
    }
  }
  
  // Tech workers smoke less
  if (userProfile?.developer?.detected || occupation.includes('developer') || 
      occupation.includes('engineer') || occupation.includes('tech')) {
    smokingScore *= 0.6;
    smokingSignals.push('tech industry (lower rates)');
  }
  
  // Age is a strong factor for younger generations
  if (ageStr === '18-24' || ageStr === '25-34') {
    smokingSignals.push('younger generation (declining smoking rates)');
  }
  
  // Clamp
  smokingScore = Math.min(50, Math.max(2, smokingScore));
  
  let smokes: string;
  if (smokingScore >= 25) {
    smokes = `Possible (${Math.round(smokingScore)}% regional rate${smokingSignals[0] ? ', ' + smokingSignals[0] : ''})`;
  } else if (smokingScore >= 15) {
    smokes = `Unlikely (${smokingSignals[0] || 'below average probability'})`;
  } else if (smokingScore >= 8) {
    smokes = `Very unlikely (${smokingSignals.slice(0, 2).join(', ') || 'low probability'})`;
  } else {
    smokes = 'Highly unlikely (multiple low-risk factors)';
  }
  
  // ============================================
  // TRAVEL PREDICTION
  // ============================================
  let travelScore = 30; // Base
  const travelSignals: string[] = [];
  
  // Income is primary factor
  if (aiAnalysis.incomeLevel === 'high') {
    travelScore += 35;
    travelSignals.push('high disposable income');
  } else if (aiAnalysis.incomeLevel === 'medium') {
    travelScore += 15;
    travelSignals.push('moderate income');
  } else {
    travelScore -= 10;
    travelSignals.push('budget constraints');
  }
  
  // Multiple languages = likely traveler or international background
  const languages = browser?.languages || [];
  if (languages.length >= 3) {
    travelScore += 20;
    travelSignals.push(`speaks ${languages.length}+ languages`);
  } else if (languages.length >= 2) {
    travelScore += 10;
    travelSignals.push('bilingual');
  }
  
  // Device signals
  if (aiAnalysis.deviceTier === 'premium') {
    travelScore += 10;
    travelSignals.push('premium device');
  }
  
  // Occupation-based
  if (occupation.includes('consult') || occupation.includes('sales') || 
      occupation.includes('executive') || occupation.includes('business')) {
    travelScore += 20;
    travelSignals.push('travel-heavy profession');
  } else if (occupation.includes('remote') || occupation.includes('freelance')) {
    travelScore += 15;
    travelSignals.push('location-independent work');
  }
  
  // Check for timezone vs location mismatch (could indicate recent travel)
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const expectedTimezone = network?.timezone;
  if (expectedTimezone && browserTimezone && !browserTimezone.includes(expectedTimezone.split('/')[0])) {
    travelScore += 15;
    travelSignals.push('timezone mismatch (possible travel)');
  }
  
  // Family status affects travel
  // If we detected parent patterns, travel might be more family-oriented
  // but less frequent
  
  // Clamp
  travelScore = Math.min(95, Math.max(10, travelScore));
  
  let travel: string;
  if (travelScore >= 75) {
    travel = `Frequently (${travelSignals.slice(0, 2).join(', ')})`;
  } else if (travelScore >= 55) {
    travel = `Regularly (${travelSignals[0] || 'moderate indicators'})`;
  } else if (travelScore >= 40) {
    travel = `Occasionally (${travelSignals[0] || 'some travel likely'})`;
  } else if (travelScore >= 25) {
    travel = 'Rarely (limited indicators)';
  } else {
    travel = `Prioritizes local (${travelSignals[0] || 'low travel indicators'})`;
  }

  return {
    caffeine,
    drinksAlcohol,
    smokes,
    travel,
  };
}

export function generateFinancialProfile(
  aiAnalysis: AIAnalysis,
  hardware: HardwareData,
  cryptoWallets: CryptoWallets
): FinancialProfile {
  // Shopping style
  let shoppingStyle = 'Unknown';
  if (aiAnalysis.deviceTier === 'premium') {
    shoppingStyle = 'Premium buyer';
  } else if (aiAnalysis.deviceTier === 'high-end') {
    shoppingStyle = 'Quality-focused';
  } else if (aiAnalysis.deviceTier === 'mid-range') {
    shoppingStyle = 'Value-conscious';
  } else {
    shoppingStyle = 'Budget-conscious';
  }

  // Brand affinity based on detected hardware
  const brands: string[] = [];
  const gpu = hardware.gpu?.toLowerCase() || '';
  
  if (gpu.includes('nvidia') || gpu.includes('geforce') || gpu.includes('rtx') || gpu.includes('gtx')) {
    brands.push('NVIDIA');
  }
  if (gpu.includes('amd') || gpu.includes('radeon')) {
    brands.push('AMD');
  }
  if (gpu.includes('intel') && !gpu.includes('apple')) {
    brands.push('Intel');
  }
  if (gpu.includes('apple') || gpu.includes('m1') || gpu.includes('m2') || gpu.includes('m3')) {
    brands.push('Apple');
  }
  
  // Browser-based brand detection
  if (navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edg')) {
    brands.push('Google');
  }
  if (navigator.userAgent.includes('Firefox')) {
    brands.push('Mozilla/Firefox');
  }
  if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
    brands.push('Apple');
  }
  if (navigator.userAgent.includes('Edg')) {
    brands.push('Microsoft');
  }
  
  if (cryptoWallets.phantom) brands.push('Solana ecosystem');
  if (cryptoWallets.metamask) brands.push('Ethereum ecosystem');

  return {
    shoppingStyle,
    brandAffinity: [...new Set(brands)].slice(0, 5),
  };
}

export function generateUserProfileFlags(
  hardware: HardwareData,
  browser: BrowserData,
  botDetection: BotDetectionData,
  behavioral: BehavioralData,
  apiSupport: APISupport,
  trackingDetection: TrackingDetection,
  cryptoWallets: CryptoWallets,
  storage?: { quota: number; used: number; usagePercent: number }
): UserProfileFlags {
  // NOTE: Storage API measures THIS WEBSITE's storage only, not overall browser cache
  // So storage data is only meaningful for detecting returning visitors, not user type
  const storageUsedMB = storage?.used ? Math.round(storage.used / 1e6) : 0;
  const isReturningVisitor = storageUsedMB > 0; // Has cached data from previous visits
  
  // Developer detection
  let developerScore = 0;
  if (browser.userAgent.includes('Developer') || browser.userAgent.includes('Canary')) developerScore += 40;
  if (botDetection.devToolsOpen) developerScore += 35;
  if ((hardware.cpuCores || 0) >= 8) developerScore += 15;
  if (apiSupport.webAssembly && apiSupport.webgpu) developerScore += 10;
  if (behavioral.typing.averageWPM > 60) developerScore += 15;
  // Returning visitor who is a developer = more confident
  if (isReturningVisitor && developerScore > 30) developerScore += 5;
  
  // Gamer detection
  let gamerScore = 0;
  const gpuInfo = getGPUInfo(hardware.gpu);
  if (gpuInfo && (gpuInfo.tier === 'premium' || gpuInfo.tier === 'high')) {
    if (!hardware.gpu?.toLowerCase().includes('quadro') && !hardware.gpu?.toLowerCase().includes('a100')) {
      gamerScore += 40; // Gaming GPU, not workstation
    }
  }
  if ((hardware.cpuCores || 0) >= 8 && (hardware.ram || 0) >= 16) gamerScore += 25;
  if (apiSupport.gamepads) gamerScore += 20;
  if (hardware.screenWidth >= 2560) gamerScore += 10;
  
  // Designer detection  
  let designerScore = 0;
  if (hardware.pixelRatio >= 2) designerScore += 20;
  if (hardware.colorDepth >= 30) designerScore += 20;
  if (hardware.gpu?.toLowerCase().includes('quadro') || hardware.gpu?.toLowerCase().includes('m1') || hardware.gpu?.toLowerCase().includes('m2') || hardware.gpu?.toLowerCase().includes('m3')) {
    designerScore += 30;
  }
  if (isProfessionalScreen(hardware.screenWidth, hardware.screenHeight)) designerScore += 15;
  
  // Power user detection - based on hardware, behavior, and session depth
  let powerUserScore = 0;
  if ((hardware.cpuCores || 0) >= 8) powerUserScore += 20;
  if ((hardware.ram || 0) >= 16) powerUserScore += 20;
  if (browser.historyLength > 10) powerUserScore += 15; // Deep current session
  if (browser.historyLength > 50) powerUserScore += 10; // Very deep session
  if (behavioral.typing.averageWPM > 50) powerUserScore += 20;
  if (trackingDetection.adBlocker) powerUserScore += 10;
  // Returning visitor bonus (they've used this site enough to cache data)
  if (isReturningVisitor) powerUserScore += 5;
  
  // Privacy conscious
  let privacyScore = 0;
  if (trackingDetection.adBlocker) privacyScore += 35;
  if (trackingDetection.doNotTrack) privacyScore += 20;
  if (trackingDetection.globalPrivacyControl) privacyScore += 25;
  if (cryptoWallets.hasAnyWallet) privacyScore += 15;
  
  // Tech savvy
  let techSavvyScore = 0;
  if (apiSupport.webgpu) techSavvyScore += 15;
  if (apiSupport.webAssembly) techSavvyScore += 10;
  if (cryptoWallets.hasAnyWallet) techSavvyScore += 20;
  if ((hardware.cpuCores || 0) >= 8) techSavvyScore += 15;
  if (developerScore > 50) techSavvyScore += 25;
  if (trackingDetection.adBlocker) techSavvyScore += 10;

  return {
    developer: { detected: developerScore >= 50, confidence: Math.min(developerScore, 100) },
    gamer: { detected: gamerScore >= 50, confidence: Math.min(gamerScore, 100) },
    designer: { detected: designerScore >= 50, confidence: Math.min(designerScore, 100) },
    powerUser: { detected: powerUserScore >= 50, confidence: Math.min(powerUserScore, 100) },
    privacyConscious: { detected: privacyScore >= 50, confidence: Math.min(privacyScore, 100) },
    techSavvy: { detected: techSavvyScore >= 50, confidence: Math.min(techSavvyScore, 100) },
    mobileUser: { detected: browser.mobile, confidence: browser.mobile ? 95 : 5 },
    workDevice: { detected: false, confidence: 25 },
  };
}

export function generatePersonalityTraits(
  _behavioral: BehavioralData,
  trackingDetection: TrackingDetection,
  apiSupport: APISupport
): PersonalityTraits {
  return {
    cautious: trackingDetection.adBlocker || trackingDetection.doNotTrack,
    privacyFocused: trackingDetection.adBlocker && (trackingDetection.doNotTrack || !!trackingDetection.globalPrivacyControl),
    earlyAdopter: apiSupport.webgpu || apiSupport.webAssembly,
  };
}

export function generateInferredInterests(
  cryptoWallets: CryptoWallets,
  trackingDetection: TrackingDetection,
  apiSupport: APISupport,
  _hardware: HardwareData,
  userProfile: UserProfileFlags
): InferredInterests {
  return {
    cryptocurrency: (cryptoWallets.phantom || cryptoWallets.metamask || cryptoWallets.coinbase) 
      ? 'Likely interested' : 'Unknown',
    privacy: trackingDetection.adBlocker ? 'Likely interested' : 'Unknown',
    modernWebTechnologies: apiSupport.webgpu ? 'Likely interested' : 'Unknown',
    gaming: userProfile.gamer.detected ? 'Likely interested' : 'Unknown',
    design: userProfile.designer.detected ? 'Likely interested' : 'Unknown',
    development: userProfile.developer.detected ? 'Likely interested' : 'Unknown',
  };
}

export function generateCreepyInsights(
  hardware: HardwareData,
  network: NetworkData,
  browser: BrowserData,
  botDetection: BotDetectionData,
  behavioral: BehavioralData,
  cryptoWallets: CryptoWallets,
  trackingDetection: TrackingDetection,
  userProfile: UserProfileFlags,
  _aiAnalysis: AIAnalysis,
  socialLogins?: SocialLogins
): string[] {
  // Get more specific predictions for insights (use enhanced version if social logins available)
  const ageResult = socialLogins 
    ? predictAgeRangeEnhanced(hardware, browser, behavioral, network, botDetection, cryptoWallets, trackingDetection, socialLogins)
    : predictAgeRange(hardware, browser, behavioral, network, botDetection, cryptoWallets, trackingDetection);
  const incomeResult = predictIncomeLevel(hardware, network, browser, trackingDetection);
  const occupationResult = socialLogins
    ? predictOccupationEnhanced(hardware, browser, behavioral, cryptoWallets, trackingDetection, botDetection, socialLogins)
    : predictOccupation(
        hardware, browser, behavioral, botDetection, cryptoWallets,
        { bluetooth: false, usb: false, midi: false, gamepads: false, webgpu: false, sharedArrayBuffer: false, serviceWorker: false, webWorker: false, webAssembly: typeof WebAssembly !== 'undefined', webSocket: typeof WebSocket !== 'undefined', webRTC: false, notifications: false, pushAPI: false, paymentRequest: false, credentialsAPI: false, clipboardAPI: false },
        network
      );
  
  return generateCreepyInsightsInternal(
    hardware,
    network,
    browser,
    botDetection,
    behavioral,
    cryptoWallets,
    trackingDetection,
    userProfile,
    ageResult.range,
    incomeResult.estimate,
    occupationResult.occupation,
    socialLogins
  );
}
