import type { HardwareData, NetworkData, BehavioralData, Persona } from '../store/useProfileStore';

// GPU tier databases
const PREMIUM_GPU_KEYWORDS = [
  'RTX 4090', 'RTX 4080', 'RTX 3090', 'RTX 3080 Ti',
  'RX 7900 XTX', 'RX 7900 XT', 'RX 6900 XT',
  'Quadro RTX', 'Tesla', 'A100', 'A6000',
  'M2 Ultra', 'M2 Max', 'M3 Max', 'M1 Ultra', 'M1 Max',
];

const HIGH_END_GPU_KEYWORDS = [
  'RTX 4070', 'RTX 3080', 'RTX 3070',
  'RX 7800', 'RX 6800',
  'M1 Pro', 'M2 Pro', 'M3 Pro', 'M3',
];

const MID_GPU_KEYWORDS = [
  'RTX 4060', 'RTX 3060', 'RTX 2080', 'RTX 2070', 'RTX 2060',
  'GTX 1080', 'GTX 1070', 'GTX 1660',
  'RX 7700', 'RX 7600', 'RX 6700', 'RX 6600', 'RX 5700',
  'M1', 'M2',
];

const DEVELOPER_BROWSER_KEYWORDS = [
  'Developer', 'Canary', 'Nightly', 'Beta',
];

function isPremiumGpu(gpu: string | null): boolean {
  if (!gpu) return false;
  const gpuLower = gpu.toLowerCase();
  return PREMIUM_GPU_KEYWORDS.some(keyword => 
    gpuLower.includes(keyword.toLowerCase())
  );
}

function isHighEndGpu(gpu: string | null): boolean {
  if (!gpu) return false;
  const gpuLower = gpu.toLowerCase();
  return HIGH_END_GPU_KEYWORDS.some(keyword => 
    gpuLower.includes(keyword.toLowerCase())
  );
}

function isMidRangeGpu(gpu: string | null): boolean {
  if (!gpu) return false;
  const gpuLower = gpu.toLowerCase();
  return MID_GPU_KEYWORDS.some(keyword => 
    gpuLower.includes(keyword.toLowerCase())
  );
}

function isIntegratedGpu(gpu: string | null): boolean {
  if (!gpu) return false;
  const gpuLower = gpu.toLowerCase();
  return ['intel', 'uhd', 'hd graphics', 'integrated'].some(keyword => 
    gpuLower.includes(keyword)
  );
}

function isAppleSilicon(gpu: string | null): boolean {
  if (!gpu) return false;
  const gpuLower = gpu.toLowerCase();
  return ['m1', 'm2', 'm3'].some(keyword => gpuLower.includes(keyword));
}

function isDeveloperBrowser(): boolean {
  const userAgent = navigator.userAgent;
  return DEVELOPER_BROWSER_KEYWORDS.some(keyword => 
    userAgent.includes(keyword)
  );
}

function hasDevTools(): boolean {
  // Check window size difference as proxy for devtools
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;
  return widthThreshold || heightThreshold;
}

function getTechLevel(hardware: HardwareData): string {
  const hasPremiumGpu = isPremiumGpu(hardware.gpu);
  const hasHighEndGpu = isHighEndGpu(hardware.gpu);
  const hasMidGpu = isMidRangeGpu(hardware.gpu);
  const hasHighCores = (hardware.cpuCores || 0) >= 8;
  const hasVeryHighCores = (hardware.cpuCores || 0) >= 16;
  const hasHighRam = (hardware.ram || 0) >= 16;
  const hasVeryHighRam = (hardware.ram || 0) >= 32;
  const isDevBrowser = isDeveloperBrowser();
  const hasDevToolsOpen = hasDevTools();
  const hasHighDpi = hardware.pixelRatio >= 2;
  const has4kScreen = hardware.screenWidth >= 3840;
  const hasApple = isAppleSilicon(hardware.gpu);

  // Workstation/Professional tier
  if (hasVeryHighCores || hasVeryHighRam || hasPremiumGpu) {
    return 'Workstation Pro';
  }
  
  // Tech Specialist tier
  if (isDevBrowser || hasDevToolsOpen || (hasHighEndGpu && hasHighCores)) {
    return 'Tech Specialist';
  }
  
  // Power User tier
  if (hasHighEndGpu || (hasMidGpu && hasHighRam) || has4kScreen) {
    return 'Power User';
  }
  
  // Apple ecosystem user
  if (hasApple) {
    return 'Apple Enthusiast';
  }
  
  // Tech Savvy tier
  if (hasMidGpu || hasHighCores || hasHighDpi) {
    return 'Tech Savvy';
  }
  
  // Budget/Casual tier
  if (isIntegratedGpu(hardware.gpu)) {
    return 'Everyday User';
  }
  
  return 'Standard User';
}

function getCurrentState(behavioral: BehavioralData): string {
  const { typing, mouse, attention, scroll } = behavioral;

  // Very high tab switching = severely distracted
  if (attention.tabSwitches > 15) {
    return 'Severely Distracted';
  }
  
  // High tab switching = distracted
  if (attention.tabSwitches > 8) {
    return 'Distracted Multi-tasker';
  }

  // Multiple rage clicks = very frustrated
  if (mouse.rageClicks > 3) {
    return 'Highly Frustrated';
  }
  
  // Rage clicks = frustrated
  if (mouse.rageClicks > 0) {
    return 'Frustrated / Impatient';
  }

  // High erratic movements = chaotic
  if (mouse.erraticMovements > 15) {
    return 'Anxious Searching';
  }
  
  if (mouse.erraticMovements > 8) {
    return 'Chaotic Energy';
  }

  // Good typing + no tab switches = focused
  if (typing.totalKeystrokes > 20 && attention.tabSwitches < 2) {
    return 'Hyper-Focused';
  }
  
  // High engagement with content
  if (scroll.scrollEvents > 10 && scroll.maxDepth > 50 && attention.tabSwitches < 3) {
    return 'Deeply Engaged';
  }
  
  // Reading mode - lots of scrolling, few clicks
  if (scroll.scrollEvents > 5 && mouse.totalClicks < 5 && mouse.movements > 100) {
    return 'Reading Mode';
  }

  // Low activity = zen
  if (typing.totalKeystrokes < 5 && mouse.totalClicks < 5 && mouse.movements > 50) {
    return 'Zen Mode';
  }
  
  // Moderate activity = exploring
  if (mouse.totalDistance > 3000 && mouse.totalClicks > 5) {
    return 'Active Explorer';
  }

  return 'Balanced State';
}

function getBehavioralProfile(behavioral: BehavioralData): string {
  const { typing, mouse, scroll } = behavioral;

  // Very fast typing + high velocity mouse = power user
  if (typing.averageWPM > 80 && mouse.averageVelocity > 600) {
    return 'Power Keyboard Warrior';
  }
  
  // Fast typing + high velocity mouse = decisive
  if (typing.averageWPM > 60 && mouse.averageVelocity > 500) {
    return 'Decisive Commander';
  }
  
  // Fast typing alone suggests professional
  if (typing.averageWPM > 70) {
    return 'Professional Typist';
  }

  // Slow deliberate typing + low velocity = methodical
  if (typing.averageWPM > 0 && typing.averageWPM < 30 && mouse.averageVelocity < 300 && mouse.movements > 50) {
    return 'Methodical Analyst';
  }
  
  // Slow typing with high hold time = careful thinker
  if (typing.averageWPM > 0 && typing.averageWPM < 40 && typing.averageHoldTime > 150) {
    return 'Careful Thinker';
  }

  // High scroll + high mouse distance = researcher
  if (scroll.scrollEvents > 15 && mouse.totalDistance > 5000) {
    return 'Thorough Researcher';
  }
  
  // High mouse distance = explorer
  if (mouse.totalDistance > 8000) {
    return 'Visual Explorer';
  }
  
  if (mouse.totalDistance > 5000) {
    return 'Content Scanner';
  }

  // Fast typing = efficient
  if (typing.averageWPM > 50) {
    return 'Efficient Operator';
  }

  // High clicks with low movement = button clicker
  if (mouse.totalClicks > 20 && mouse.totalDistance < 2000) {
    return 'Point-and-Click User';
  }
  
  // High clicks = interactive
  if (mouse.totalClicks > 15) {
    return 'Interactive Navigator';
  }
  
  // Low engagement
  if (mouse.movements < 50 && typing.totalKeystrokes < 10 && scroll.scrollEvents < 5) {
    return 'Passive Observer';
  }

  return 'Adaptive User';
}

function getVibeCheck(
  hardware: HardwareData, 
  behavioral: BehavioralData,
  _network: NetworkData
): string {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const isLateNight = hour >= 1 && hour < 5;
  const isNight = hour >= 22 || hour < 1;
  const isEarlyMorning = hour >= 5 && hour < 7;
  const isMorning = hour >= 7 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 17;
  const isEvening = hour >= 17 && hour < 22;

  const hasPremium = isPremiumGpu(hardware.gpu);
  const hasHighEnd = isHighEndGpu(hardware.gpu);
  const hasApple = isAppleSilicon(hardware.gpu);
  const isGamer = (hasPremium || hasHighEnd) && (hardware.cpuCores || 0) >= 6 && !hardware.gpu?.toLowerCase().includes('quadro');
  const isDeveloper = isDeveloperBrowser() || hasDevTools() || (hardware.cpuCores || 0) >= 12;
  const isCreative = hasApple && hardware.pixelRatio >= 2;
  const isFocused = behavioral.attention.tabSwitches < 2 && behavioral.typing.totalKeystrokes > 10;
  const isDistracted = behavioral.attention.tabSwitches > 10;
  const isFrustrated = behavioral.mouse.rageClicks > 2 || behavioral.mouse.erraticMovements > 10;
  const isExplorer = behavioral.mouse.totalDistance > 5000;
  const isReader = behavioral.scroll.scrollEvents > 10 && behavioral.mouse.totalClicks < 10;
  const hasCoffeeTime = hour >= 6 && hour < 10;

  // Very late night personas
  if (isLateNight && isDeveloper) return 'The 3AM Debugger';
  if (isLateNight && isFrustrated) return 'The Insomniac Struggler';
  if (isLateNight && isGamer) return 'The All-Night Gamer';
  if (isLateNight) return 'The Night\'s Edge Wanderer';

  // Night personas  
  if (isNight && isGamer) return 'The Night Owl Gamer';
  if (isNight && isDeveloper && isFocused) return 'The Midnight Coder';
  if (isNight && isDeveloper) return 'The After-Hours Dev';
  if (isNight && isCreative) return 'The Nocturnal Creative';
  if (isNight && isFocused) return 'The After-Hours Grinder';
  if (isNight && isDistracted) return 'The Sleepless Scroller';
  if (isNight) return 'The Nocturnal Browser';

  // Early morning personas
  if (isEarlyMorning && isDeveloper) return 'The Dawn Coder';
  if (isEarlyMorning && isFocused) return 'The Early Bird Achiever';
  if (isEarlyMorning) return 'The Sunrise Starter';

  // Morning personas
  if (isMorning && isDeveloper && hasCoffeeTime) return 'The Coffee-Fueled Dev';
  if (isMorning && isDeveloper) return 'The Morning Engineer';
  if (isMorning && isCreative) return 'The Morning Creative';
  if (isMorning && isFocused) return 'The Productive Morning Person';
  if (isMorning && isExplorer) return 'The Morning Explorer';
  if (isMorning && isWeekend) return 'The Weekend Morning Warrior';
  if (isMorning) return 'The Fresh Starter';

  // Afternoon personas
  if (isAfternoon && isDeveloper && isFrustrated) return 'The Afternoon Bug Fighter';
  if (isAfternoon && isDeveloper) return 'The Afternoon Engineer';
  if (isAfternoon && isFocused && !isWeekend) return 'The Work Mode Pro';
  if (isAfternoon && isDistracted && !isWeekend) return 'The Afternoon Procrastinator';
  if (isAfternoon && isReader) return 'The Afternoon Reader';
  if (isAfternoon && isGamer && isWeekend) return 'The Weekend Afternoon Gamer';
  if (isAfternoon && isWeekend) return 'The Lazy Weekend Surfer';
  if (isAfternoon) return 'The Steady Navigator';

  // Evening personas
  if (isEvening && isGamer) return 'The Evening Warrior';
  if (isEvening && isDeveloper && isFocused) return 'The Twilight Coder';
  if (isEvening && isCreative) return 'The Evening Artist';
  if (isEvening && isFocused) return 'The Twilight Scholar';
  if (isEvening && isExplorer) return 'The Sunset Wanderer';
  if (isEvening && isReader) return 'The Evening Reader';
  if (isEvening && isWeekend) return 'The Weekend Wind-Down';
  if (isEvening) return 'The Evening Browser';

  return 'The Digital Explorer';
}

function generateDescription(
  techLevel: string,
  currentState: string,
  behavioralProfile: string,
  vibeCheck: string,
  hardware: HardwareData,
  behavioral: BehavioralData,
  network: NetworkData
): string {
  const parts: string[] = [];
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Opening based on vibe
  parts.push(`You appear to be "${vibeCheck}".`);

  // Technical assessment - more specific
  if (techLevel === 'Workstation Pro') {
    parts.push('Your workstation-class hardware suggests professional work—possibly video editing, 3D rendering, or software development at scale.');
  } else if (techLevel === 'Tech Specialist') {
    parts.push('Your system configuration suggests deep technical expertise—likely a senior developer, data scientist, or tech lead.');
  } else if (techLevel === 'Power User') {
    parts.push('Your hardware setup indicates someone who demands performance—gaming enthusiast, content creator, or professional who doesn\'t compromise.');
  } else if (techLevel === 'Apple Enthusiast') {
    parts.push('Your Apple Silicon setup suggests you value the ecosystem—likely creative work, development, or someone who appreciates premium hardware.');
  } else if (techLevel === 'Tech Savvy') {
    parts.push('You have a capable setup that balances performance with practicality—someone who knows what they need.');
  } else if (techLevel === 'Everyday User') {
    parts.push('Your integrated graphics suggest a work laptop or budget-conscious setup—practical and gets the job done.');
  } else {
    parts.push('Your system is optimized for everyday tasks—efficient and no-nonsense.');
  }

  // Hardware specifics with more insight
  if (hardware.gpu) {
    const gpuShort = hardware.gpu.length > 35 
      ? hardware.gpu.substring(0, 35) + '...' 
      : hardware.gpu;
    
    if (isPremiumGpu(hardware.gpu)) {
      parts.push(`That ${gpuShort} is serious hardware—you've invested in top-tier computing.`);
    } else if (isHighEndGpu(hardware.gpu)) {
      parts.push(`Your ${gpuShort} shows you care about performance without going overboard.`);
    } else if (isAppleSilicon(hardware.gpu)) {
      parts.push(`Your ${gpuShort} puts you in Apple's ecosystem—efficiency and integration are your priorities.`);
    } else if (isIntegratedGpu(hardware.gpu)) {
      parts.push(`Your ${gpuShort} suggests portability matters more than raw power.`);
    }
  }

  // Behavioral insights - more detailed
  if (currentState === 'Hyper-Focused') {
    parts.push('Your laser-focused attention pattern suggests you\'re in the zone—deep work mode engaged.');
  } else if (currentState === 'Deeply Engaged') {
    parts.push('You\'re thoroughly absorbing this content—high engagement without distraction.');
  } else if (currentState === 'Severely Distracted' || currentState === 'Distracted Multi-tasker') {
    parts.push(`${behavioral.attention.tabSwitches} tab switches detected—your mind is juggling many things at once.`);
  } else if (currentState === 'Highly Frustrated' || currentState === 'Frustrated / Impatient') {
    parts.push(`We detected frustration (${behavioral.mouse.rageClicks} rage clicks)—something isn\'t working the way you expected.`);
  } else if (currentState === 'Anxious Searching') {
    parts.push('Your erratic mouse movements suggest you\'re searching for something—or just having a chaotic moment.');
  } else if (currentState === 'Reading Mode') {
    parts.push('You\'re in reading mode—scrolling through content methodically.');
  }

  // Location + time context
  if (network.city && network.country) {
    const timeOfDay = hour < 6 ? 'late night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';
    const weekendNote = isWeekend ? ' on your weekend' : '';
    parts.push(`Connecting from ${network.city}, ${network.country} this ${timeOfDay}${weekendNote}.`);
  }

  // Behavioral profile - more nuanced
  if (behavioralProfile === 'Power Keyboard Warrior' || behavioralProfile === 'Professional Typist') {
    parts.push(`Your ${behavioral.typing.averageWPM} WPM typing speed is impressive—you live on the keyboard.`);
  } else if (behavioralProfile === 'Decisive Commander') {
    parts.push('Your quick keystrokes and direct mouse movements reveal decisiveness and confidence.');
  } else if (behavioralProfile === 'Methodical Analyst' || behavioralProfile === 'Careful Thinker') {
    parts.push('Your deliberate, measured interactions suggest analytical thinking—you consider before you act.');
  } else if (behavioralProfile === 'Thorough Researcher') {
    parts.push('Your extensive scrolling and mouse travel shows you\'re here to learn, not just browse.');
  } else if (behavioralProfile === 'Visual Explorer' || behavioralProfile === 'Content Scanner') {
    parts.push(`Your mouse traveled ${Math.round(behavioral.mouse.totalDistance)} pixels—you\'re a visual explorer.`);
  }

  // Battery insight with more context
  if (hardware.battery) {
    if (hardware.battery.level < 0.15 && !hardware.battery.charging) {
      parts.push('⚠️ Battery critical—you\'re either brave or reckless. Save your work!');
    } else if (hardware.battery.level < 0.3 && !hardware.battery.charging) {
      parts.push('Your battery is low and unplugged—away from your usual workspace or living dangerously?');
    } else if (hardware.battery.level > 0.9 && hardware.battery.charging) {
      parts.push('Fully charged and plugged in—stationed at your primary workspace.');
    }
  }

  return parts.join(' ');
}

export function generatePersona(
  hardware: HardwareData,
  network: NetworkData,
  behavioral: BehavioralData
): Persona {
  const techLevel = getTechLevel(hardware);
  const currentState = getCurrentState(behavioral);
  const behavioralProfile = getBehavioralProfile(behavioral);
  const vibeCheck = getVibeCheck(hardware, behavioral, network);
  const description = generateDescription(
    techLevel,
    currentState,
    behavioralProfile,
    vibeCheck,
    hardware,
    behavioral,
    network
  );

  return {
    techLevel,
    currentState,
    behavioralProfile,
    vibeCheck,
    description,
  };
}

export function getBrowserInfo(): { name: string; version: string } {
  const ua = navigator.userAgent;
  
  if (ua.includes('Firefox')) {
    const match = ua.match(/Firefox\/(\d+)/);
    return { name: 'Firefox', version: match?.[1] || 'Unknown' };
  }
  if (ua.includes('Edg')) {
    const match = ua.match(/Edg\/(\d+)/);
    return { name: 'Edge', version: match?.[1] || 'Unknown' };
  }
  if (ua.includes('Chrome')) {
    const match = ua.match(/Chrome\/(\d+)/);
    return { name: 'Chrome', version: match?.[1] || 'Unknown' };
  }
  if (ua.includes('Safari')) {
    const match = ua.match(/Version\/(\d+)/);
    return { name: 'Safari', version: match?.[1] || 'Unknown' };
  }
  
  return { name: 'Unknown', version: 'Unknown' };
}

export function getOSInfo(): string {
  const ua = navigator.userAgent;
  
  if (ua.includes('Windows NT 10')) return 'Windows 10/11';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac OS X')) {
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    return `macOS ${match?.[1]?.replace('_', '.') || ''}`.trim();
  }
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  
  return 'Unknown OS';
}
