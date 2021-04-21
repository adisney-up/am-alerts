'use strict';

class LogSink {
  constructor(log) {
    this.log = log;

  }
  send(message) {
    log.info(message);
  }
}

/**
 * Module exports.
 */

module.exports = LogSink;
