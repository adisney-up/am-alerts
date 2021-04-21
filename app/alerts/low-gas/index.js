'use strict';

/**
 * Module dependencies.
 */

const config = require('config');
const GasNowDatasource = require('../../../src/datasource/gasnow');
const logging = require('../../../src/logging');
const TelegramSink = require('../../../src/sink/telegram');

const log = logging.consoleLogger();

let tripped = false;

function onGas(gasThreshold, gasNow, sink) {
  return () => {
    const currentGas = gasNow.rapidGasPrice();

    if (currentGas.lt(gasThreshold) && !tripped) {
      log.info('Gas price has been below threshold during entire sample period. Sending alert...');

      tripped = true;
      sink.send('Gas price has been low! Maybe time to do something cool....', 'Low gas!');
    } else if (currentGas.gte(gasThreshold)) {
      log.debug('Gas price has been above threshold during sample period. No alert.');
      tripped = false;
    }
  }
}

async function main() {
  const sink = new TelegramSink({ ...config.get('sink.telegram'), apiRoot: 'https://api.telegram.org' });
  const { gasThreshold } = config.get('alert.lowGas');
  const gasNow = new GasNowDatasource({ ...config.get('alert.lowGas.datasource.gasnow'), log });

  gasNow.on('tick', onGas(gasThreshold, gasNow, sink));

  await gasNow.start();
}

main()
  .catch(error => log.error(error));
