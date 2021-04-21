'use strict';

/**
 * Module dependencies.
 */

const EventEmitter = require('events');
const got = require('got');
const ethers = require('ethers');
const Decimal = require('decimal.js');

/**
 * gasnow.org datasource
 */

class GasNowDatasource extends EventEmitter {
  ONE_GWEI = ethers.utils.parseUnits('1', 'gwei');

  constructor({ url, interval, windowSize, log }) {
    super();
    this.url = url;
    this.interval = interval;
    this.windowSize = windowSize;
    this.log = log;

    this.priceWindow = [];
  }

  async start() {
    this.log.info(`Polling for gas prices from gasnow.org every ${this.interval}ms`);

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

    if (body.code === 200) {
      const { rapid: newRapidPrice } = body.data;

      this.updatePriceCache(newRapidPrice);
      this.emit('tick', newRapidPrice);
    } else {
      this.log.warn(`Received non-200 status code: ${body.code}`);
      this.log.warn(response);
    }
  }

  updatePriceCache(newPrice) {
    this.priceWindow.push(newPrice);

    if (this.priceWindow.length > this.windowSize) {
      this.priceWindow.shift();
    }

    this.log.debug(this.priceWindow);
  }

  rapidGasPrice() {
    const maxPriceInWindow = Math.max(...this.priceWindow);

    return ethers.BigNumber.from(maxPriceInWindow).add(this.ONE_GWEI);
  }

  rapidGasPriceInEtherDecimal() {
    return new Decimal(ethers.utils.formatUnits(this.rapidGasPrice().toString()));
  }
}

/**
 * Module exports.
 */

module.exports = GasNowDatasource;
