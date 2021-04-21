'use strict';

const EventEmitter = require('events');

class EthereumDatasource extends EventEmitter {
  constructor(provider, log) {
    super();

    this.provider = provider;
    this.log = log;
  }

  start() {
    this.provider.on('block', this.tick.bind(this));
  }

  tick(blockHeight) {
    this.log.debug(`New block: ${blockHeight}`);
    this.emit('tick', blockHeight);
  }
}

/**
 * Module exports.
 */

module.exports = EthereumDatasource;

