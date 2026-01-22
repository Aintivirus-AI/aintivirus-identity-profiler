export type LogLevel = 'SYSTEM' | 'ALERT' | 'DATA' | 'INFO' | 'SCAN';

export interface ConsoleEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
}

let entryCounter = 0;

export function createConsoleEntry(level: LogLevel, message: string): ConsoleEntry {
  return {
    id: `entry-${Date.now()}-${entryCounter++}`,
    timestamp: new Date(),
    level,
    message,
  };
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getLevelColor(level: LogLevel): string {
  switch (level) {
    case 'SYSTEM':
      return 'text-cyber-cyan';
    case 'ALERT':
      return 'text-cyber-red';
    case 'DATA':
      return 'text-cyber-green';
    case 'INFO':
      return 'text-cyber-text-dim';
    case 'SCAN':
      return 'text-cyber-purple';
    default:
      return 'text-cyber-text';
  }
}
