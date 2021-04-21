'use strict';

const config = require('config');

class BancorPoolThresholdAlert {
  constructor(ethereumDatasource, sink, contract, log) {
    this.ethereumDatasource = ethereumDatasource;
    this.sink = sink;
    this.liquidityProtectionContract = contract;
    this.log = log;

    const { name: poolName, address: poolAddress } = config.get('alert.bancorPoolThreshold.contracts.vBntBntPool');
    this.poolAddress = poolAddress;
    this.poolName = poolName;
  }

  start() {
    this.ethereumDatasource.on('tick', this.tick.bind(this));
  }

  async tick() {
    const [baseTokenAvailableSpace,] = await this.liquidityProtectionContract.poolAvailableSpace(this.poolAddress);

    this.log.debug(`Checking available space`);
    this.log.debug(JSON.stringify({ baseTokenAvailableSpace: baseTokenAvailableSpace.toString(), lastAvailableSpace: this.lastAvailableSpace ? this.lastAvailableSpace.toString() : 'not set' }));

    if (this.hasAvailableSpaceChanged(baseTokenAvailableSpace)) {
      this.log.debug('Available space has changed. Sending alert');

      const spaceChange = this.lastAvailableSpace.sub(baseTokenAvailableSpace);

      this.sink.send(`${this.poolName} available space changed from ${this.lastAvailableSpace.toString()} to ${baseTokenAvailableSpace.toString()}. Change of ${spaceChange}.`);
    }

    this.lastAvailableSpace = baseTokenAvailableSpace;
  }

  hasAvailableSpaceChanged(newAvailableSpace) {
    return this.lastAvailableSpace ? !this.lastAvailableSpace.eq(newAvailableSpace) : false;
  }
}

module.exports = BancorPoolThresholdAlert;
