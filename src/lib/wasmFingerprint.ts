/**
 * WebAssembly (WASM) fingerprinting module
 * Collects browser-specific WASM characteristics for fingerprinting purposes
 */

import { simpleHash } from './fingerprinting';

/**
 * WASM feature support detection results
 */
export interface WasmFeatures {
  basic: boolean;
  simd: boolean;
  threads: boolean;
  exceptions: boolean;
  tailCall: boolean;
  gc: boolean;
  relaxedSimd: boolean;
  multiMemory: boolean;
  extendedConst: boolean;
  referenceTypes: boolean;
  bulkMemory: boolean;
  mutableGlobals: boolean;
  signExtension: boolean;
  nonTrappingFptoint: boolean;
  bigInt: boolean;
}

/**
 * WASM compute benchmark results
 */
export interface WasmBenchmark {
  intOpsPerMs: number;
  floatOpsPerMs: number;
  memoryThroughputMBps: number;
  fibonacciTimeMs: number;
  cpuTier: number;
}

/**
 * Complete WASM fingerprint data
 */
export interface WasmFingerprint {
  supported: boolean;
  features: WasmFeatures;
  benchmark: WasmBenchmark | null;
  memoryLimits: {
    maxPages: number;
    initialPages: number;
  } | null;
  fingerprintHash: string;
  confidence: number;
}

/**
 * Detect basic WASM support
 */
function detectBasicWasmSupport(): boolean {
  try {
    if (typeof WebAssembly !== 'object') return false;
    if (typeof WebAssembly.instantiate !== 'function') return false;
    if (typeof WebAssembly.compile !== 'function') return false;
    if (typeof WebAssembly.Module !== 'function') return false;
    if (typeof WebAssembly.Instance !== 'function') return false;
    if (typeof WebAssembly.Memory !== 'function') return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Test if a specific WASM feature is supported by trying to compile a minimal module
 */
async function testWasmFeature(wasmBytes: Uint8Array): Promise<boolean> {
  try {
    await WebAssembly.compile(wasmBytes as BufferSource);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect all WASM features
 */
async function detectWasmFeatures(): Promise<WasmFeatures> {
  const features: WasmFeatures = {
    basic: detectBasicWasmSupport(),
    simd: false,
    threads: false,
    exceptions: false,
    tailCall: false,
    gc: false,
    relaxedSimd: false,
    multiMemory: false,
    extendedConst: false,
    referenceTypes: false,
    bulkMemory: false,
    mutableGlobals: false,
    signExtension: false,
    nonTrappingFptoint: false,
    bigInt: typeof BigInt !== 'undefined',
  };

  if (!features.basic) return features;

  // SIMD detection
  const simdBytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7b,
    0x03, 0x02, 0x01, 0x00,
    0x0a, 0x0a, 0x01, 0x08, 0x00, 0xfd, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0b
  ]);
  features.simd = await testWasmFeature(simdBytes);

  // Threads detection
  try {
    if (typeof SharedArrayBuffer !== 'undefined') {
      const sharedMem = new WebAssembly.Memory({ initial: 1, maximum: 1, shared: true } as WebAssembly.MemoryDescriptor);
      features.threads = sharedMem.buffer instanceof SharedArrayBuffer;
    }
  } catch {
    features.threads = false;
  }

  // Tail call detection
  const tailCallBytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x04, 0x01, 0x60, 0x00, 0x00,
    0x03, 0x02, 0x01, 0x00,
    0x0a, 0x06, 0x01, 0x04, 0x00, 0x12, 0x00, 0x0b
  ]);
  features.tailCall = await testWasmFeature(tailCallBytes);

  // Bulk memory operations
  const bulkMemBytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x04, 0x01, 0x60, 0x00, 0x00,
    0x03, 0x02, 0x01, 0x00,
    0x05, 0x03, 0x01, 0x00, 0x01,
    0x0a, 0x0e, 0x01, 0x0c, 0x00, 0x41, 0x00, 0x41, 0x00, 0x41, 0x00, 0xfc, 0x0a, 0x00, 0x00, 0x0b
  ]);
  features.bulkMemory = await testWasmFeature(bulkMemBytes);

  // Mutable globals
  const mutableGlobalsBytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x06, 0x06, 0x01, 0x7f, 0x01, 0x41, 0x00, 0x0b,
  ]);
  features.mutableGlobals = await testWasmFeature(mutableGlobalsBytes);

  // Sign extension operators
  const signExtBytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7f,
    0x03, 0x02, 0x01, 0x00,
    0x0a, 0x07, 0x01, 0x05, 0x00, 0x41, 0x00, 0xc0, 0x0b
  ]);
  features.signExtension = await testWasmFeature(signExtBytes);

  // Non-trapping float-to-int conversions
  const nonTrapBytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x05, 0x01, 0x60, 0x00, 0x01, 0x7f,
    0x03, 0x02, 0x01, 0x00,
    0x0a, 0x0a, 0x01, 0x08, 0x00, 0x43, 0x00, 0x00, 0x00, 0x00, 0xfc, 0x00, 0x0b
  ]);
  features.nonTrappingFptoint = await testWasmFeature(nonTrapBytes);

  return features;
}

/**
 * Create a benchmark WASM module that computes fibonacci
 */
function createBenchmarkModule(): Uint8Array {
  return new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic
    0x01, 0x00, 0x00, 0x00, // version
    // Type section
    0x01, 0x05, 0x01, 0x60, 0x01, 0x7f, 0x01, 0x7f,
    // Function section
    0x03, 0x02, 0x01, 0x00,
    // Export section
    0x07, 0x0d, 0x01, 0x09, 0x66, 0x69, 0x62, 0x6f, 0x6e, 0x61, 0x63, 0x63, 0x69, 0x00, 0x00,
    // Code section - fibonacci function
    0x0a, 0x1f, 0x01, 0x1d, 0x00,
    0x20, 0x00, 0x41, 0x02, 0x49,
    0x04, 0x7f, 0x20, 0x00,
    0x05,
    0x20, 0x00, 0x41, 0x01, 0x6b, 0x10, 0x00,
    0x20, 0x00, 0x41, 0x02, 0x6b, 0x10, 0x00,
    0x6a,
    0x0b, 0x0b,
  ]);
}

/**
 * Run WASM compute benchmarks
 */
async function runBenchmarks(): Promise<WasmBenchmark> {
  const moduleBytes = createBenchmarkModule();
  const result = await WebAssembly.instantiate(moduleBytes as BufferSource);
  const instance = result.instance;

  const exports = instance.exports as {
    fibonacci: (n: number) => number;
  };

  // Fibonacci benchmark
  const fibStart = performance.now();
  exports.fibonacci(30); // Use 30 instead of 35 for faster benchmarking
  const fibTimeMs = performance.now() - fibStart;

  // Simple integer operations benchmark using JS (WASM-style)
  const intIterations = 500000;
  const intStart = performance.now();
  let intResult = 0;
  for (let i = 0; i < intIterations; i++) {
    intResult = (intResult + i) | 0;
  }
  const intTimeMs = performance.now() - intStart;
  const intOpsPerMs = Math.round(intIterations / intTimeMs);

  // Float operations benchmark
  const floatIterations = 500000;
  const floatStart = performance.now();
  let floatResult = 0.0;
  for (let i = 0; i < floatIterations; i++) {
    floatResult += 1.0;
  }
  const floatTimeMs = performance.now() - floatStart;
  const floatOpsPerMs = Math.round(floatIterations / floatTimeMs);

  // Memory throughput benchmark
  const memSize = 1024 * 256; // 256KB
  const buffer = new Uint32Array(memSize / 4);
  const memStart = performance.now();
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = i;
  }
  const memTimeMs = performance.now() - memStart;
  const memoryThroughputMBps = (memSize / 1024 / 1024) / (memTimeMs / 1000);

  // Prevent dead code elimination
  if (intResult < 0 || floatResult < 0) console.log('bench');

  // Calculate CPU tier (1-5 based on fibonacci time)
  let cpuTier: number;
  if (fibTimeMs < 20) cpuTier = 5; // High-end desktop
  else if (fibTimeMs < 50) cpuTier = 4; // Mid-range desktop
  else if (fibTimeMs < 100) cpuTier = 3; // Low-end desktop / high-end mobile
  else if (fibTimeMs < 200) cpuTier = 2; // Low-end mobile
  else cpuTier = 1; // Very slow device

  return {
    intOpsPerMs,
    floatOpsPerMs,
    memoryThroughputMBps: Math.round(memoryThroughputMBps * 100) / 100,
    fibonacciTimeMs: Math.round(fibTimeMs * 100) / 100,
    cpuTier,
  };
}

/**
 * Detect WASM memory limits
 */
async function detectMemoryLimits(): Promise<{ maxPages: number; initialPages: number }> {
  let maxPages = 256; // Default to 16MB

  // Test how many pages we can allocate (binary search)
  let low = 256;
  let high = 65536;

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    try {
      new WebAssembly.Memory({ initial: 1, maximum: mid });
      low = mid;
    } catch {
      high = mid - 1;
    }
  }

  maxPages = low;

  // Test initial pages limit
  let initialPages = 1;
  for (const pages of [1, 16, 64, 256]) {
    try {
      new WebAssembly.Memory({ initial: pages });
      initialPages = pages;
    } catch {
      break;
    }
  }

  return { maxPages, initialPages };
}

/**
 * Generate fingerprint hash from all collected data
 */
function generateFingerprintHash(
  features: WasmFeatures,
  benchmark: WasmBenchmark | null,
  memoryLimits: { maxPages: number; initialPages: number } | null
): string {
  const components: string[] = [];

  // Features fingerprint
  components.push(
    Object.entries(features)
      .map(([k, v]) => `${k}:${v ? 1 : 0}`)
      .join(',')
  );

  // Benchmark fingerprint (quantized)
  if (benchmark) {
    components.push(
      [
        Math.round(benchmark.intOpsPerMs / 1000),
        Math.round(benchmark.floatOpsPerMs / 1000),
        Math.round(benchmark.memoryThroughputMBps / 10),
        Math.round(benchmark.fibonacciTimeMs),
        benchmark.cpuTier,
      ].join('|')
    );
  }

  // Memory limits
  if (memoryLimits) {
    components.push(`mem:${memoryLimits.maxPages}:${memoryLimits.initialPages}`);
  }

  return simpleHash(components.join('::'));
}

/**
 * Get complete WASM fingerprint
 */
export async function getWasmFingerprint(): Promise<WasmFingerprint> {
  // Check basic support first
  if (!detectBasicWasmSupport()) {
    return {
      supported: false,
      features: {
        basic: false,
        simd: false,
        threads: false,
        exceptions: false,
        tailCall: false,
        gc: false,
        relaxedSimd: false,
        multiMemory: false,
        extendedConst: false,
        referenceTypes: false,
        bulkMemory: false,
        mutableGlobals: false,
        signExtension: false,
        nonTrappingFptoint: false,
        bigInt: false,
      },
      benchmark: null,
      memoryLimits: null,
      fingerprintHash: simpleHash('wasm-unsupported'),
      confidence: 0,
    };
  }

  // Collect features
  let features: WasmFeatures;
  try {
    features = await detectWasmFeatures();
  } catch {
    features = {
      basic: true,
      simd: false,
      threads: false,
      exceptions: false,
      tailCall: false,
      gc: false,
      relaxedSimd: false,
      multiMemory: false,
      extendedConst: false,
      referenceTypes: false,
      bulkMemory: false,
      mutableGlobals: false,
      signExtension: false,
      nonTrappingFptoint: false,
      bigInt: typeof BigInt !== 'undefined',
    };
  }

  // Run benchmarks
  let benchmark: WasmBenchmark | null = null;
  try {
    benchmark = await runBenchmarks();
  } catch {
    // Benchmark failed
  }

  // Detect memory limits
  let memoryLimits: { maxPages: number; initialPages: number } | null = null;
  try {
    memoryLimits = await detectMemoryLimits();
  } catch {
    // Memory limits detection failed
  }

  // Generate fingerprint hash
  const fingerprintHash = generateFingerprintHash(features, benchmark, memoryLimits);

  // Calculate confidence
  let confidence = 0;
  if (features.basic) confidence += 40;
  const featureCount = Object.values(features).filter(v => v === true).length;
  confidence += Math.min(30, featureCount * 2);
  if (benchmark) confidence += 20;
  if (memoryLimits) confidence += 10;

  return {
    supported: true,
    features,
    benchmark,
    memoryLimits,
    fingerprintHash,
    confidence: Math.min(100, confidence),
  };
}
