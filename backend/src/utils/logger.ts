/**
 * Uvicorn-style custom console logger.
 * Uses standard ANSI color codes for clean, professional terminal output.
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  info: '\x1b[36m',   // Cyan
  success: '\x1b[32m',// Green
  warn: '\x1b[33m',   // Yellow
  error: '\x1b[31m',  // Red
  debug: '\x1b[35m',  // Magenta
};

export const logger = {
  info: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    console.log(`${colors.dim}[${timestamp}]${colors.reset} ${colors.info}INFO:${colors.reset}    ${message}`, ...args);
  },

  success: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    console.log(`${colors.dim}[${timestamp}]${colors.reset} ${colors.success}SUCCESS:${colors.reset} ${message}`, ...args);
  },

  warn: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    console.warn(`${colors.dim}[${timestamp}]${colors.reset} ${colors.warn}WARNING:${colors.reset} ${message}`, ...args);
  },

  error: (message: string, error?: any, ...args: any[]) => {
    const timestamp = new Date().toISOString();
    console.error(
      `${colors.dim}[${timestamp}]${colors.reset} ${colors.error}ERROR:${colors.reset}   ${message}`,
      error ? `\nReason: ${error.message || error}` : '',
      ...args
    );
    if (error && error.stack) {
      console.error(`${colors.dim}${error.stack}${colors.reset}`);
    }
  },

  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      console.log(`${colors.dim}[${timestamp}]${colors.reset} ${colors.debug}DEBUG:${colors.reset}   ${message}`, ...args);
    }
  }
};
