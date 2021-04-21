'use strict';

/**
 * Module dependencies.
 */

const Push = require('pushover-notifications');

class PushoverSink {
  constructor({ user, token, log } = {}) {
    this.push = new Push({ user, token });
    this.log = log;
  }

  send(message, title) {
    const msg = {
      message,
      title,
      device: 'asset-management-alerts',
    }

    this.push.send(msg, (err, result) => {
      if (err) {
        this.log.error('Could not send pushover notification');
        this.log.error(err);
      } else {
        this.log.debug(result);
      }
    });
  }
}

/**
 * Module exports.
 */

module.exports = PushoverSink;
