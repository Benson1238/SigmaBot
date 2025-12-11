import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const logDir = resolve(process.cwd(), 'logs');

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

const logFile = resolve(logDir, 'bot.log');

export function log(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;
  appendFileSync(logFile, entry, 'utf8');
  // Also print to console for visibility
  // eslint-disable-next-line no-console
  console.log(entry.trimEnd());
}

export function logError(error) {
  const errorMessage = typeof error === 'string' ? error : error?.stack ?? JSON.stringify(error);
  log(`ERROR: ${errorMessage}`);
}
