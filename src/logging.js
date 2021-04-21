'use strict';

/**
 * Module dependencies.
 */

const winston = require('winston');
const ethers = require('ethers');

/*
 * Constants.
 */

const fullFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  if (typeof message !== 'string') {
    message = JSON.stringify(message);
  }

  return `${timestamp} - ${level.toUpperCase()}: ${stack || message}`;
});
const serializingFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  let copy;

  if (message instanceof Object) {
    copy = JSON.parse(JSON.stringify(message));
    for (const [key, value] of Object.entries(message)) {
      if (value instanceof ethers.BigNumber) {
        copy[key] = value.toString();
      }
    }

    copy = JSON.stringify(copy);
  }

  return `${timestamp} - ${level.toUpperCase()}: ${stack || copy || message}`;
});
const prettyPlainFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.prettyPrint()
);

/**
 * Module exports.
 */

module.exports = {
  consoleLogger(level) {
    if (!level && process.env.LOG_LEVEL) {
      level = process.env.LOG_LEVEL.toLowerCase();
    }
    const format = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      serializingFormat
    );

    return winston.createLogger({
      level,
      format,
      transports: [new winston.transports.Console()],
    });
  },
};
