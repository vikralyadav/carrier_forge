import fs from 'fs-extra';
import path from 'path';

class Logger {
  constructor(service) {
    this.service = service;
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.service,
      message,
      ...meta
    };
    return JSON.stringify(logEntry);
  }

  writeToFile(level, message, meta = {}) {
    const logFile = path.join(this.logDir, `${this.service}-${new Date().toISOString().split('T')[0]}.log`);
    const logEntry = this.formatMessage(level, message, meta);
    
    try {
      fs.appendFileSync(logFile, logEntry + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message, meta = {}) {
    console.log(`[${this.service}] INFO:`, message, meta);
    this.writeToFile('INFO', message, meta);
  }

  error(message, meta = {}) {
    console.error(`[${this.service}] ERROR:`, message, meta);
    this.writeToFile('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    console.warn(`[${this.service}] WARN:`, message, meta);
    this.writeToFile('WARN', message, meta);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.service}] DEBUG:`, message, meta);
      this.writeToFile('DEBUG', message, meta);
    }
  }

  // Performance logging
  performance(operation, duration, meta = {}) {
    this.info(`Performance: ${operation}`, { 
      duration: `${duration}ms`,
      ...meta 
    });
  }

  // API request logging
  request(method, url, statusCode, responseTime, meta = {}) {
    this.info(`API Request: ${method} ${url}`, {
      statusCode,
      responseTime: `${responseTime}ms`,
      ...meta
    });
  }

  // Agent execution logging
  agentExecution(agentName, input, output, executionTime, meta = {}) {
    this.info(`Agent Execution: ${agentName}`, {
      input: typeof input === 'string' ? input.substring(0, 100) + '...' : input,
      output: typeof output === 'string' ? output.substring(0, 100) + '...' : output,
      executionTime: `${executionTime}ms`,
      ...meta
    });
  }

  // Career progression tracking
  careerProgress(userId, action, details, meta = {}) {
    this.info(`Career Progress: ${action}`, {
      userId,
      details,
      ...meta
    });
  }
}

export const createLogger = (service) => {
  return new Logger(service);
};

// Global logger for system events
export const systemLogger = createLogger('system');

// Utility function for timing operations
export const withTiming = async (logger, operation, fn) => {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logger.performance(operation, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`Failed ${operation}`, { duration: `${duration}ms`, error: error.message });
    throw error;
  }
};
