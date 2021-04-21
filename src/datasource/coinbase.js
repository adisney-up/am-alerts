'use strict';

/**
 * Module dependencies.
 */

const EventEmitter = require('events');
const got = require('got');
const Decimal = require('decimal.js');

/**
 * Coinbase datasource
 */

class CoinbaseDatasource extends EventEmitter {
  constructor({ url, interval, staleMultiplier, log }) {
    super();
    this.url = url;
    this.interval = interval;
    this.staleMultiplier = staleMultiplier;
    this.log = log;
  }

  async start() {
    this.log.info(`Polling for coinbase prices every ${this.interval}ms at endpoint ${this.url}`);

    await this.tickAndScheduleNext();
  }

  async tickAndScheduleNext() {
    try {
      await this.tick();
    } catch (error) {
      this.log.error('Error in `tick`');
      this.log.error(error);
    }

    setTimeout(this.tickAndScheduleNext.bind(this), this.interval);
  }

  async tick() {
    const response = await got.get(this.url);
    const body = JSON.parse(response.body);

    const price = new Decimal(body.price);

    this.currentPrice = price;
    this.lastReceived = new Date(body.time);
    this.emit('tick', price);
  }

  isStale() {
    if (this.lastReceived) {
      const sinceLastReceived = new Date(Date.now()).getTime() - this.lastReceived.getTime();

      return sinceLastReceived > this.interval * this.staleMultiplier;
    }

    return true;
  }
}

/**
 * Module exports.
 */

module.exports = CoinbaseDatasource;
