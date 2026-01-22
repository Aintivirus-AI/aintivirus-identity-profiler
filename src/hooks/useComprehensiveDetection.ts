import { useEffect, useRef } from 'react';
import { useProfileStore } from '../store/useProfileStore';
import {
  getCanvasFingerprint,
  getAudioFingerprint,
  getWebGLFingerprint,
  detectFonts,
  getSpeechVoicesFingerprint,
  getMathFingerprint,
  getTimingFingerprint,
  getErrorFingerprint,
  countNavigatorProps,
  countWindowProps,
  detectVideoCodecs,
  detectAudioCodecs,
  detectDRM,
  detectHeadless,
  detectAutomation,
  detectVM,
  detectAdBlocker,
  detectIncognito,
  detectDevTools,
  detectCryptoWallets,
  detectSocialLogins,
  checkPermissions,
  getMediaDevices,
  getStorageQuota,
  getJSMemory,
  getClientHints,
  detectChromeAI,
  // New enhanced fingerprinting
  getWebRTCLocalIPs,
  getCSSPreferences,
  getHardwareFamily,
  detectVPN,
  detectInstalledApps,
  detectExtensions,
  generateCrossBrowserId,
  generateFingerprintId,
} from '../lib/fingerprinting';
import { getWasmFingerprint } from '../lib/wasmFingerprint';
import { getWebGPUFingerprint } from '../lib/webgpuFingerprint';
import {
  generateAIAnalysis,
  generateUserProfileFlags,
  generatePersonalityTraits,
  generateCreepyInsights,
  generateLifestyleHabits,
} from '../lib/aiAnalysis';
import { generateEnhancedProfile } from '../lib/enhancedProfiling';
import { useAIAnalysis } from './useAIAnalysis';

export function useComprehensiveDetection() {
  const {
    hardware,
    setHardware,
    setNetwork,
    setBrowser,
    setFingerprints,
    setBotDetection,
    setPermissions,
    setMediaDevices,
    setStorage,
    setMediaCodecs,
    setJSMemory,
    setChromeAI,
    setTrackingDetection,
    setCryptoWallets,
    setSocialLogins,
    setVPNDetection,
    setSystemPreferences,
    setAIAnalysis,
    setPersonalLife,
    setMentalPhysical,
    setLifestyle,
    setFinancial,
    setCreepyInsights,
    setUserProfile,
    setPersonalityTraits,
    addConsoleEntry,
    setScanProgress,
  } = useProfileStore();

  const { runAIAnalysis } = useAIAnalysis();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const runDetection = async () => {
      addConsoleEntry('SCAN', 'Starting comprehensive fingerprint analysis...');
      let progress = 0;
      const updateProgress = (increment: number) => {
        progress += increment;
        setScanProgress(Math.min(progress, 100));
      };

      // ============================================
      // HARDWARE DETECTION
      // ============================================
      try {
        // WebGL detection
        const webgl = getWebGLFingerprint();
        setHardware({
          webglVersion: webgl.version,
          webglExtensions: webgl.extensions,
        });
        setFingerprints({ webglHash: webgl.hash });
        addConsoleEntry('DATA', `WebGL: ${webgl.version || 'Not available'}`);
        updateProgress(5);

        // Enhanced display info
        setHardware({
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          colorDepth: screen.colorDepth,
          orientation: screen.orientation?.type || 'unknown',
          maxTouchPoints: navigator.maxTouchPoints || 0,
        });
        addConsoleEntry('DATA', `Display: ${screen.width}x${screen.height} @${window.devicePixelRatio}x`);
        updateProgress(5);
      } catch (e) {
        addConsoleEntry('ALERT', 'Hardware detection partially failed');
      }

      // ============================================
      // BROWSER & CLIENT HINTS
      // ============================================
      try {
        const clientHints = await getClientHints();
        setBrowser({
          architecture: clientHints.architecture,
          bitness: clientHints.bitness,
          mobile: clientHints.mobile || /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent),
          model: clientHints.model,
          platformVersion: clientHints.platformVersion,
          browserVersions: clientHints.browserVersions,
          historyLength: window.history.length,
          pdfViewer: navigator.pdfViewerEnabled ?? false,
        });
        addConsoleEntry('DATA', `Architecture: ${clientHints.architecture || 'unknown'}`);
        updateProgress(5);
      } catch (e) {
        addConsoleEntry('INFO', 'Client hints not fully available');
      }

      // ============================================
      // FINGERPRINTS
      // ============================================
      try {
        // Canvas fingerprint
        const canvasHash = getCanvasFingerprint();
        setFingerprints({ canvasHash });
        addConsoleEntry('DATA', `Canvas hash: ${canvasHash || 'blocked'}`);
        updateProgress(5);

        // Audio fingerprint
        const audioHash = await getAudioFingerprint();
        setFingerprints({ audioHash });
        addConsoleEntry('DATA', `Audio hash: ${audioHash || 'blocked'}`);
        updateProgress(5);

        // Fonts detection
        const fontsDetected = detectFonts();
        setFingerprints({ fontsDetected });
        addConsoleEntry('DATA', `Fonts detected: ${fontsDetected}`);
        updateProgress(5);

        // Speech voices
        const voices = await getSpeechVoicesFingerprint();
        setFingerprints({ speechVoices: voices.count, voicesHash: voices.hash });
        addConsoleEntry('DATA', `Speech voices: ${voices.count}`);
        updateProgress(5);

        // Math fingerprint
        const mathHash = getMathFingerprint();
        setFingerprints({ mathHash });
        updateProgress(3);

        // Timing fingerprint
        const timingHash = getTimingFingerprint();
        setFingerprints({ timingHash });
        updateProgress(3);

        // Error fingerprint
        const errorHash = getErrorFingerprint();
        setFingerprints({ errorHash });
        updateProgress(2);

        // Property counts
        const navigatorProps = countNavigatorProps();
        const windowProps = countWindowProps();
        setFingerprints({ navigatorProps, windowProps });
        updateProgress(2);
      } catch (e) {
        addConsoleEntry('ALERT', 'Some fingerprints could not be collected');
      }

      // ============================================
      // WASM & WEBGPU FINGERPRINTS (ENHANCED)
      // ============================================
      try {
        const wasmFp = await getWasmFingerprint();
        const wasmFeatureNames = Object.entries(wasmFp.features)
          .filter(([, v]) => v === true)
          .map(([k]) => k);
        setFingerprints({
          wasmSupported: wasmFp.supported,
          wasmFeatures: wasmFeatureNames,
          wasmMaxMemory: wasmFp.memoryLimits?.maxPages ? wasmFp.memoryLimits.maxPages * 64 / 1024 : null, // Convert to MB
          wasmHash: wasmFp.fingerprintHash,
          wasmSimd: wasmFp.features.simd,
          wasmThreads: wasmFp.features.threads,
          wasmExceptions: wasmFp.features.exceptions,
          wasmBulkMemory: wasmFp.features.bulkMemory,
          wasmCpuTier: wasmFp.benchmark?.cpuTier || 0,
          wasmBenchmarkScore: wasmFp.benchmark ? Math.round(wasmFp.benchmark.intOpsPerMs / 1000) : null,
        });
        addConsoleEntry('DATA', `WASM: ${wasmFeatureNames.length} features, CPU tier ${wasmFp.benchmark?.cpuTier || 'N/A'}`);
        updateProgress(5);

        const webgpuFp = await getWebGPUFingerprint();
        setFingerprints({
          webgpuAvailable: webgpuFp.available,
          webgpuVendor: webgpuFp.adapterInfo?.vendor || null,
          webgpuArchitecture: webgpuFp.adapterInfo?.architecture || null,
          webgpuDevice: webgpuFp.adapterInfo?.device || null,
          webgpuDescription: webgpuFp.adapterInfo?.description || null,
          webgpuFallbackAdapter: webgpuFp.adapterInfo?.isFallbackAdapter || false,
          webgpuFeatureCount: webgpuFp.features.length,
          webgpuKeyFeatures: webgpuFp.features.slice(0, 10),
          webgpuCanvasFormat: webgpuFp.preferredCanvasFormat,
          webgpuComputeTiming: webgpuFp.computeTimingFingerprint?.avgExecutionTime || null,
          webgpuTimingPattern: webgpuFp.computeTimingFingerprint?.patternHash || null,
          webgpuHash: webgpuFp.fingerprintHash,
          webgpuLimits: webgpuFp.limits as Record<string, number> | null,
        });
        if (webgpuFp.available) {
          addConsoleEntry('DATA', `WebGPU: ${webgpuFp.adapterInfo?.vendor || 'available'} - ${webgpuFp.features.length} features`);
        }
        updateProgress(5);
      } catch (e) {
        addConsoleEntry('INFO', 'Advanced fingerprints not available');
      }

      // ============================================
      // WEBRTC LOCAL IPS
      // ============================================
      try {
        const webrtcInfo = await getWebRTCLocalIPs();
        setNetwork({
          webrtcSupported: webrtcInfo.supported,
          webrtcLocalIPs: webrtcInfo.localIPs,
        });
        if (webrtcInfo.localIPs.length > 0) {
          addConsoleEntry('DATA', `WebRTC Local IPs: ${webrtcInfo.localIPs.join(', ')}`);
        }
        updateProgress(3);
      } catch (e) {
        addConsoleEntry('INFO', 'WebRTC IP detection not available');
      }

      // ============================================
      // EXTENSIONS & INSTALLED APPS
      // ============================================
      try {
        const extensions = detectExtensions();
        const installedApps = await detectInstalledApps();
        const hardwareFamily = getHardwareFamily();
        
        setFingerprints({
          extensionsDetected: extensions,
          installedApps: installedApps,
          hardwareFamily: hardwareFamily,
        });
        
        if (extensions.length > 0) {
          addConsoleEntry('DATA', `Extensions detected: ${extensions.join(', ')}`);
        }
        if (hardwareFamily) {
          addConsoleEntry('DATA', `Hardware family: ${hardwareFamily}`);
        }
        updateProgress(3);
      } catch (e) {
        addConsoleEntry('INFO', 'Extension detection completed');
      }

      // ============================================
      // CROSS-BROWSER ID
      // ============================================
      try {
        const crossBrowserId = generateCrossBrowserId();
        const fingerprintId = generateFingerprintId({
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          screenColorDepth: window.screen.colorDepth,
          devicePixelRatio: window.devicePixelRatio,
          hardwareConcurrency: navigator.hardwareConcurrency,
          platform: navigator.platform,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          webglRenderer: hardware.gpu,
          webglVendor: hardware.gpuVendor,
          canvasFingerprint: useProfileStore.getState().fingerprints.canvasHash,
          audioFingerprint: useProfileStore.getState().fingerprints.audioHash,
          fontsDetected: useProfileStore.getState().fingerprints.fontsDetected,
          mathFingerprint: useProfileStore.getState().fingerprints.mathHash,
          errorFingerprint: useProfileStore.getState().fingerprints.errorHash,
        });
        
        setFingerprints({
          crossBrowserId: crossBrowserId.id,
          crossBrowserFactors: crossBrowserId.factors,
          fingerprintId: fingerprintId.id,
          fingerprintConfidence: fingerprintId.confidence,
        });
        
        addConsoleEntry('DATA', `Fingerprint ID: ${fingerprintId.id} (${fingerprintId.confidence}% confidence)`);
        addConsoleEntry('DATA', `Cross-browser ID: ${crossBrowserId.id}`);
        updateProgress(2);
      } catch (e) {
        addConsoleEntry('INFO', 'Fingerprint ID generation completed');
      }

      // ============================================
      // CSS PREFERENCES
      // ============================================
      try {
        const cssPrefs = getCSSPreferences();
        setSystemPreferences({
          colorScheme: cssPrefs.prefersColorScheme as 'light' | 'dark' | 'no-preference',
          reducedMotion: cssPrefs.prefersReducedMotion,
          reducedTransparency: cssPrefs.prefersReducedTransparency,
          contrast: cssPrefs.prefersContrast,
          forcedColors: cssPrefs.forcedColors,
          colorGamut: cssPrefs.colorGamut,
          hdrSupport: cssPrefs.hdrSupported,
          invertedColors: cssPrefs.invertedColors,
        });
        addConsoleEntry('DATA', `Color scheme: ${cssPrefs.prefersColorScheme}, Gamut: ${cssPrefs.colorGamut}`);
        updateProgress(2);
      } catch (e) {
        addConsoleEntry('INFO', 'CSS preferences detection completed');
      }

      // ============================================
      // BOT DETECTION
      // ============================================
      try {
        const isHeadless = detectHeadless();
        const isAutomated = detectAutomation();
        const isVirtualMachine = detectVM();
        const incognitoMode = await detectIncognito();
        const devToolsOpen = detectDevTools();

        setBotDetection({
          isHeadless,
          isAutomated,
          isVirtualMachine,
          incognitoMode,
          devToolsOpen,
        });

        if (isHeadless) addConsoleEntry('ALERT', 'Headless browser detected');
        if (isAutomated) addConsoleEntry('ALERT', 'Automation detected');
        if (isVirtualMachine) addConsoleEntry('ALERT', 'Virtual machine detected');
        if (incognitoMode) addConsoleEntry('ALERT', 'Incognito mode detected');
        updateProgress(5);
      } catch (e) {
        addConsoleEntry('INFO', 'Bot detection partially completed');
      }

      // ============================================
      // TRACKING & PRIVACY
      // ============================================
      try {
        const adBlocker = await detectAdBlocker();
        setTrackingDetection({
          adBlocker,
          doNotTrack: navigator.doNotTrack === '1',
          globalPrivacyControl: (navigator as any).globalPrivacyControl ?? null,
        });
        if (adBlocker) addConsoleEntry('DATA', 'Ad blocker detected');
        updateProgress(5);
      } catch (e) {
        addConsoleEntry('INFO', 'Tracking detection completed');
      }

      // ============================================
      // CRYPTO WALLETS (ENHANCED)
      // ============================================
      try {
        const wallets = detectCryptoWallets();
        setCryptoWallets(wallets);
        
        const detectedWallets: string[] = [];
        if (wallets.metamask) detectedWallets.push('MetaMask');
        if (wallets.phantom) detectedWallets.push('Phantom');
        if (wallets.coinbase) detectedWallets.push('Coinbase');
        if (wallets.braveWallet) detectedWallets.push('Brave Wallet');
        if (wallets.trustWallet) detectedWallets.push('Trust Wallet');
        if (wallets.binanceWallet) detectedWallets.push('Binance');
        if (wallets.solflare) detectedWallets.push('Solflare');
        if (wallets.tronLink) detectedWallets.push('TronLink');
        
        if (detectedWallets.length > 0) {
          addConsoleEntry('DATA', `Crypto wallets: ${detectedWallets.join(', ')}`);
        }
        updateProgress(3);
      } catch (e) {
        addConsoleEntry('INFO', 'Wallet detection completed');
      }

      // ============================================
      // SOCIAL LOGINS DETECTION
      // ============================================
      try {
        const socialLogins = detectSocialLogins();
        setSocialLogins(socialLogins);
        
        const detectedLogins: string[] = [];
        if (socialLogins.google) detectedLogins.push('Google');
        if (socialLogins.facebook) detectedLogins.push('Facebook');
        if (socialLogins.twitter) detectedLogins.push('Twitter');
        if (socialLogins.github) detectedLogins.push('GitHub');
        if (socialLogins.reddit) detectedLogins.push('Reddit');
        
        if (detectedLogins.length > 0) {
          addConsoleEntry('DATA', `Social logins detected: ${detectedLogins.join(', ')}`);
        }
        updateProgress(2);
      } catch (e) {
        addConsoleEntry('INFO', 'Social login detection completed');
      }

      // ============================================
      // VPN DETECTION
      // ============================================
      try {
        const networkState = useProfileStore.getState().network;
        const webrtcLocalIPs = networkState.webrtcLocalIPs || [];
        const vpnInfo = await detectVPN(networkState.timezone || undefined, webrtcLocalIPs);
        
        setVPNDetection({
          likelyUsingVPN: vpnInfo.likelyUsingVPN,
          timezoneMismatch: vpnInfo.timezoneMismatch,
          webrtcLeak: vpnInfo.webrtcLeak,
        });
        
        if (vpnInfo.likelyUsingVPN) {
          addConsoleEntry('ALERT', 'VPN/Proxy detected');
        }
        if (vpnInfo.webrtcLeak) {
          addConsoleEntry('ALERT', 'WebRTC IP leak detected');
        }
        updateProgress(2);
      } catch (e) {
        addConsoleEntry('INFO', 'VPN detection completed');
      }

      // ============================================
      // PERMISSIONS
      // ============================================
      try {
        const permissions = await checkPermissions();
        setPermissions(permissions);
        addConsoleEntry('DATA', 'Permissions scanned');
        updateProgress(3);
      } catch (e) {
        addConsoleEntry('INFO', 'Permissions check completed');
      }

      // ============================================
      // MEDIA DEVICES
      // ============================================
      try {
        const mediaDevices = await getMediaDevices();
        setMediaDevices(mediaDevices);
        addConsoleEntry('DATA', `Media: ${mediaDevices.microphones} mic, ${mediaDevices.cameras} cam, ${mediaDevices.speakers} speaker`);
        updateProgress(3);
      } catch (e) {
        addConsoleEntry('INFO', 'Media devices enumeration completed');
      }

      // ============================================
      // STORAGE
      // ============================================
      try {
        const storage = await getStorageQuota();
        setStorage(storage);
        addConsoleEntry('DATA', `Storage quota: ${(storage.quota / 1e9).toFixed(2)} GB`);
        updateProgress(3);
      } catch (e) {
        addConsoleEntry('INFO', 'Storage info not available');
      }

      // ============================================
      // MEDIA CODECS
      // ============================================
      try {
        const videoCodecs = detectVideoCodecs();
        const audioCodecs = detectAudioCodecs();
        const drm = await detectDRM();
        setMediaCodecs({
          videoCodecs,
          audioCodecs,
          widevineDRM: drm.widevine,
          fairPlayDRM: drm.fairplay,
          playReadyDRM: drm.playready,
        });
        addConsoleEntry('DATA', `Video codecs: ${videoCodecs.length}, Audio codecs: ${audioCodecs.length}`);
        updateProgress(3);
      } catch (e) {
        addConsoleEntry('INFO', 'Codec detection completed');
      }

      // ============================================
      // JS MEMORY
      // ============================================
      try {
        const memory = getJSMemory();
        setJSMemory(memory);
        if (memory.heapLimit) {
          addConsoleEntry('DATA', `Heap limit: ${(memory.heapLimit / 1e9).toFixed(2)} GB`);
        }
        updateProgress(2);
      } catch (e) {
        addConsoleEntry('INFO', 'Memory info not available');
      }

      // ============================================
      // CHROME AI
      // ============================================
      try {
        const chromeAI = await detectChromeAI();
        const browserMatch = navigator.userAgent.match(/Chrome\/(\d+)/);
        setChromeAI({
          supported: chromeAI.supported,
          browserVersion: browserMatch ? `Chrome ${browserMatch[1]}` : 'Unknown',
          minVersionMet: browserMatch ? parseInt(browserMatch[1]) >= 121 : false,
          apis: chromeAI.apis,
        });
        updateProgress(2);
      } catch (e) {
        addConsoleEntry('INFO', 'Chrome AI detection completed');
      }

      // ============================================
      // HEURISTIC ANALYSIS (Using local data-driven correlations)
      // ============================================
      addConsoleEntry('SCAN', 'Running AI analysis on collected data...');
      
      // Wait a moment for all state to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get current state
      const state = useProfileStore.getState();
      
      try {
        // Run the heuristic analysis (calls local analysis engine via server)
        const aiSuccess = await runAIAnalysis();
        
        if (aiSuccess) {
          // AI analysis updated the stores directly
          updateProgress(20);
        } else {
          // Fallback to client-side heuristics if server fails
          addConsoleEntry('INFO', 'Using enhanced local analysis...');
          
          // Use the new enhanced profiling engine for more accurate predictions
          const enhancedProfile = generateEnhancedProfile(
            state.hardware,
            state.network,
            state.browser,
            state.behavioral,
            state.fingerprints,
            state.botDetection,
            state.cryptoWallets,
            state.socialLogins,
            state.trackingDetection,
            state.systemPreferences
          );
          
          addConsoleEntry('DATA', `Enhanced profiling complete (${enhancedProfile.overallConfidence}% confidence, ${enhancedProfile.dataQuality}% data quality)`);
          
          // Generate AI analysis using base + enhanced data
          const aiAnalysis = generateAIAnalysis(
            state.hardware,
            state.network,
            state.browser,
            state.botDetection,
            state.behavioral,
            state.cryptoWallets,
            state.trackingDetection,
            state.socialLogins,
            state.vpnDetection
          );
          
          // Override with enhanced profile data (more accurate)
          aiAnalysis.ageRange = enhancedProfile.age.range;
          aiAnalysis.incomeLevel = enhancedProfile.income.level as 'low' | 'medium' | 'high' | 'unknown';
          aiAnalysis.occupation = enhancedProfile.occupation.primary;
          aiAnalysis.education = enhancedProfile.education.level;
          aiAnalysis.workStyle = enhancedProfile.workStyle.type;
          aiAnalysis.lifeSituation = enhancedProfile.livingArrangement.type;
          
          setAIAnalysis(aiAnalysis);
          addConsoleEntry('DATA', `Human score: ${aiAnalysis.humanScore}%, Fraud risk: ${aiAnalysis.fraudRisk}%`);
          addConsoleEntry('DATA', `Predicted: ${enhancedProfile.age.range} y/o ${enhancedProfile.occupation.primary}, ${enhancedProfile.income.estimate}`);
          updateProgress(3);

          // Use enhanced personal life guesses
          setPersonalLife({
            parent: enhancedProfile.hasChildren.likely 
              ? `Likely (${enhancedProfile.hasChildren.confidence}% confidence)${enhancedProfile.hasChildren.ageGroup ? ` - ${enhancedProfile.hasChildren.ageGroup.replace(/_/g, ' ')}` : ''}`
              : `Unlikely (${100 - enhancedProfile.hasChildren.confidence}% confidence)`,
            petOwner: 'Unknown', // Hard to determine without more signals
            homeowner: enhancedProfile.livingArrangement.type,
            carOwner: enhancedProfile.livingArrangement.type.includes('Family') ? 'Likely' : 'Unknown',
            socialType: enhancedProfile.relationshipStatus.status,
          });
          updateProgress(2);

          // Enhanced mental/physical state
          setMentalPhysical({
            stressLevel: enhancedProfile.stressLevel.level.toLowerCase() as 'low' | 'medium' | 'high' | 'unknown',
            sleepSchedule: enhancedProfile.workStyle.type.toLowerCase().includes('night') ? 'late' :
                          enhancedProfile.workStyle.type.toLowerCase().includes('early') ? 'early' : 'normal',
            fitnessLevel: 'unknown',
            healthConscious: enhancedProfile.currentMood.state,
          });
          updateProgress(2);

          // Enhanced lifestyle habits using comprehensive analysis
          const lifestyleHabits = generateLifestyleHabits(
            aiAnalysis,
            state.behavioral,
            state.network,
            state.browser,
            state.userProfile
          );
          setLifestyle(lifestyleHabits);
          updateProgress(2);

          // Enhanced financial profile
          setFinancial({
            shoppingStyle: enhancedProfile.financialProfile.type,
            brandAffinity: [
              ...(state.hardware.gpu?.toLowerCase().includes('nvidia') ? ['NVIDIA'] : []),
              ...(state.hardware.gpu?.toLowerCase().includes('amd') ? ['AMD'] : []),
              ...(state.hardware.gpu?.toLowerCase().includes('m1') || state.hardware.gpu?.toLowerCase().includes('m2') || state.hardware.gpu?.toLowerCase().includes('m3') ? ['Apple'] : []),
              ...(state.cryptoWallets.metamask ? ['Ethereum'] : []),
              ...(state.cryptoWallets.phantom ? ['Solana'] : []),
            ].filter(Boolean),
          });
          updateProgress(2);

          // Generate enhanced creepy insights using both old and new data
          const baseInsights = generateCreepyInsights(
            state.hardware,
            state.network,
            state.browser,
            state.botDetection,
            state.behavioral,
            state.cryptoWallets,
            state.trackingDetection,
            state.userProfile,
            aiAnalysis,
            state.socialLogins
          );
          
          // Add enhanced insights from our new profiling
          const enhancedInsights = [
            ...enhancedProfile.topInsights,
            ...baseInsights,
          ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 6); // Dedupe and limit
          
          setCreepyInsights({ insights: enhancedInsights });
          addConsoleEntry('DATA', `Generated ${enhancedInsights.length} behavioral insights`);
          
          // Store enhanced profile data for UI
          useProfileStore.setState({
            aiProfileSummary: `Based on ${enhancedProfile.dataQuality >= 70 ? 'comprehensive' : 'partial'} analysis, you appear to be a ${enhancedProfile.age.range} year old ${enhancedProfile.occupation.primary.toLowerCase()}${enhancedProfile.occupation.secondary.length > 0 ? ` with interests in ${enhancedProfile.occupation.secondary.join(', ').toLowerCase()}` : ''}. ${enhancedProfile.hasChildren.likely ? 'You likely have ' + (enhancedProfile.hasChildren.ageGroup || 'children') + '.' : ''} Your ${enhancedProfile.techSavviness.level.toLowerCase()} tech savviness and ${enhancedProfile.privacyConsciousness.level.toLowerCase()} privacy consciousness suggest a ${enhancedProfile.personality.workStyle} work style.`,
            aiConfidence: enhancedProfile.overallConfidence,
            aiInterests: enhancedProfile.interests,
            aiFallback: true,
          });
          
          updateProgress(5);
        }

        // These always run (user profile flags based on technical data)
        const userProfile = generateUserProfileFlags(
          state.hardware,
          state.browser,
          state.botDetection,
          state.behavioral,
          state.apiSupport,
          state.trackingDetection,
          state.cryptoWallets,
          state.storage
        );
        setUserProfile(userProfile);

        const personalityTraits = generatePersonalityTraits(
          state.behavioral,
          state.trackingDetection,
          state.apiSupport
        );
        setPersonalityTraits(personalityTraits);
        
        // Generate enhanced inferred interests using all available data
        const enhancedInterests = {
          cryptocurrency: state.cryptoWallets.hasAnyWallet ? 'Active user' : 
                         state.socialLogins.github ? 'Likely interested' : 'Unknown',
          privacy: state.trackingDetection.adBlocker && state.trackingDetection.doNotTrack ? 'Highly interested' :
                  state.trackingDetection.adBlocker ? 'Likely interested' : 'Unknown',
          modernWebTechnologies: state.fingerprints.webgpuAvailable || state.botDetection.devToolsOpen ? 'Likely interested' : 'Unknown',
          gaming: userProfile.gamer.detected ? 'Active gamer' :
                 (state.hardware.gpu?.toLowerCase().includes('rtx') || state.hardware.gpu?.toLowerCase().includes('radeon')) ? 'Likely interested' : 'Unknown',
          design: userProfile.designer.detected ? 'Likely professional' :
                 (state.hardware.pixelRatio >= 2 && state.fingerprints.fontsDetected > 25) ? 'Possibly interested' : 'Unknown',
          development: userProfile.developer.detected ? 'Active developer' :
                      state.socialLogins.github ? 'Likely developer' : 'Unknown',
        };
        
        useProfileStore.getState().setInferredInterests(enhancedInterests);

      } catch (e) {
        addConsoleEntry('ALERT', 'AI analysis partially failed');
      }

      addConsoleEntry('SYSTEM', 'Comprehensive analysis complete');
      setScanProgress(100);
    };

    runDetection();
  }, []);

  // Monitor for DevTools open/close
  useEffect(() => {
    const interval = setInterval(() => {
      const devToolsOpen = detectDevTools();
      setBotDetection({ devToolsOpen });
    }, 2000);

    return () => clearInterval(interval);
  }, [setBotDetection]);
}
