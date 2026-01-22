# Digital Shadow - Identity Profiler

A dark-themed, high-fidelity "cyber-surveillance" dashboard that analyzes your digital fingerprint and behavioral patterns using client-side browser APIs with real-time multi-visitor tracking.

![Digital Shadow](https://img.shields.io/badge/React-18+-blue?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss) ![Three.js](https://img.shields.io/badge/Three.js-0.160+-black?logo=threedotjs) ![WebSocket](https://img.shields.io/badge/WebSocket-Realtime-green)

## Features

### Data Collection Engine
- **Hardware Detection**: GPU (via WebGL), CPU cores, RAM, Battery status
- **Network Tracing**: IP, ISP, Geolocation (using ipapi.co)
- **Behavioral Tracking**:
  - Typing Dynamics (WPM, keystroke hold time)
  - Mouse Patterns (rage clicks, erratic movement detection)
  - Attention Metrics (tab switches, away time)

### Multi-Visitor Globe
- **Real-time visitor tracking** via WebSocket server
- **Geolocated pins** for all connected visitors
- **Animated arcs** connecting you to other visitors worldwide
- **Live connection status** showing online visitors

### Data-Driven Heuristic Analysis
The app generates a comprehensive user profile using **local heuristic analysis** (no external AI APIs):
- **Occupation Detection**: GitHub login + DevTools = Developer, Crypto wallets = Trader, etc.
- **Age Estimation**: Based on social login patterns, hardware choices, browsing time
- **Income Inference**: Correlated from hardware specs (GPU tier, RAM, display), ISP type
- **Behavioral State**: Rage clicks, tab switches, typing patterns reveal stress/focus
- **Privacy Posture**: Ad blockers, VPN usage, incognito mode detection
- **Social Footprint**: Detects active logins (Google, GitHub, Reddit, Twitter, Facebook)

All predictions use **multi-signal correlation** - combining hardware, behavior, timing, and social signals for accuracy.

### Visual Components
- **3D Globe**: Interactive Three.js globe with multi-visitor tracking
- **Live Console**: Real-time scrolling event log
- **Identity Card**: Animated persona reveal with scanning effects
- **Stats Dashboard**: Hardware, network, and behavior metrics

## Tech Stack

- **React 18+** with TypeScript
- **Vite 5** for fast development
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **@react-three/fiber + drei** for 3D globe
- **Zustand** for state management
- **Lucide React** for icons
- **WebSocket Server** for real-time visitor tracking
- **Express** for the backend server

## Getting Started

### Frontend Only (No Multi-Visitor)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Full Experience (With Multi-Visitor Tracking)

You'll need to run both the WebSocket server and the frontend:

**Terminal 1 - Start the Server:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Start the Frontend:**
```bash
npm run dev
```

The server runs on port 3001 by default. The frontend will automatically connect to `ws://localhost:3001`.

### Production Build

```bash
# Build frontend
npm run build

# Build and start server
cd server
npm run start
```

## How It Works

### Analysis Engine
The profiling engine uses **heuristic analysis** based on proven correlations:

**Example Signals:**
- `GitHub login + DevTools open + >60 WPM typing` = Software Developer with 85%+ confidence
- `RTX 4090 GPU + P3 display + Apple M3` = High income ($120k+), creative professional  
- `Late night (11pm-2am) + Crypto wallet + Reddit login` = Age 22-32, tech-forward
- `Multiple tab switches + Rage clicks` = High stress level, distracted

All inferences are **grounded in actual collected data** - no speculation or LLM hallucination.

## Privacy Notice

**All profiling happens locally or via your own server.** No external AI APIs are called. The WebSocket server only receives your IP address (for geolocation) and tracks visitor presence. This is a demonstration of browser fingerprinting capabilities - use responsibly and ethically.

## Project Structure

```
├── server/                        # WebSocket backend
│   ├── index.ts                   # Express + WebSocket server
│   └── package.json               # Server dependencies
├── src/
│   ├── components/
│   │   ├── Globe/Globe3D.tsx      # 3D globe with multi-visitor support
│   │   ├── Console/LiveConsole.tsx # Event log
│   │   ├── AdAuction/             # Ad auction display
│   │   ├── sections/              # Data sections
│   │   └── ui/                    # Reusable UI components
│   ├── hooks/
│   │   ├── useVisitors.ts         # WebSocket visitor tracking
│   │   ├── useHardwareDetection.ts
│   │   ├── useNetworkInfo.ts
│   │   ├── useTypingDynamics.ts
│   │   ├── useMousePatterns.ts
│   │   └── useAttentionTracker.ts
│   ├── lib/
│   │   ├── profiler.ts            # Persona generation
│   │   └── consoleLogger.ts       # Log utilities
│   ├── store/
│   │   └── useProfileStore.ts     # Zustand store
│   ├── App.tsx                    # Main layout
│   └── index.css                  # Tailwind + custom styles
└── package.json
```

## License

MIT
