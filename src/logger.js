const pino = require('pino');

// Use `info` as our standard log level if not specified
const options = {
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

// If we're doing `debug` logging, make the logs easier to read
if (options.level === 'debug') {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: true, // Ensures that the logs are in a single line format
      translateTime: 'SYS:standard', // Format the timestamp
    },
  };
}

// Create and export a Pino Logger instance
module.exports = pino(options);
