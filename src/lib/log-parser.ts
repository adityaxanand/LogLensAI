export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'UNKNOWN';

export interface LogEntry {
  id: number;
  timestamp: Date | null;
  level: string;
  message: string;
  originalLine: string;
  category: string;
}

const LOG_LEVELS: LogLevel[] = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

// Regex to capture various timestamp formats, log levels, and messages
const LOG_REGEX = new RegExp(
  // Timestamp (optional) - matches ISO, date time, time only etc.
  `^\\s*([\\d\\-T:.Z\\s/]+[APM]*)?\\s*` + 
  // Separator (optional)
  `[|[\\]\\s-]*` +
  // Log level
  `(${LOG_LEVELS.join('|')})` +
  // Separator
  `[|\\]\\s-]*` +
  // Message
  `(.*)$`,
  'i'
);

export function parseLog(line: string, id: number): LogEntry {
  const match = line.match(LOG_REGEX);

  if (match) {
    const [_, timestampStr, level, message] = match;
    let timestamp: Date | null = null;
    if (timestampStr) {
      const parsedDate = new Date(timestampStr.trim());
      // Check if the parsed date is valid
      if (!isNaN(parsedDate.getTime())) {
        timestamp = parsedDate;
      }
    }
    
    return {
      id,
      timestamp,
      level: level.toUpperCase() as LogLevel,
      message: message.trim(),
      originalLine: line,
      category: 'UNKNOWN',
    };
  }

  // Fallback for lines that don't match the regex
  return {
    id,
    timestamp: null,
    level: 'UNKNOWN',
    message: line,
    originalLine: line,
    category: 'UNKNOWN',
  };
}

export function parseLogData(logData: string): LogEntry[] {
  if (!logData) return [];
  return logData
    .split('\n')
    .filter(line => line.trim() !== '')
    .map((line, index) => parseLog(line, index));
}
