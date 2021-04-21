'use strict';

/**
 * Module dependencies.
 */

const config = require('config');
const CoinbaseDatasource = require('../../../src/datasource/coinbase');
const logging = require('../../../src/logging');
const TwilioSink = require('../../../src/sink/twilio');

const log = logging.consoleLogger();


function onTick({ name, message, price: priceThreshold }, sink, numbersToCall) {
  let tripped = false;

  return async (currentPrice) => {
    if (currentPrice.gte(priceThreshold) && !tripped) {
      log.info(`${name} ${currentPrice} is through threshold ${priceThreshold}. Sending alert...`);
      message = message.replace('#REPLACE#', currentPrice.toFixed(3))

      tripped = true;
      for (const number of numbersToCall) {
        sink.send(number, message);
      }
    } else if (currentPrice.gte(priceThreshold)) {
      log.debug(`${name} ${currentPrice} is through threshold ${priceThreshold}. Alert already triggered. Doing nothing.`);
    } else {
      log.debug(`${name} ${currentPrice} not through threshold ${priceThreshold}. Doing nothing.`);
    }
  }
}

async function main() {
  console.log('config.get("sink.twilio")', config.get("sink.twilio"));
  const twilioSink = new TwilioSink({ ...config.get('sink.twilio') });
  const { assets, sink: { twilio: { numbersToCall } } } = config.get('alert.priceThreshold');
  const parsedNumbersToCall = JSON.parse(numbersToCall);
  const coinbaseDatasource = new CoinbaseDatasource({ ...config.get('alert.priceThreshold.datasource.coinbase'), log });

  for (const assetConfig of assets) {
    coinbaseDatasource.on('tick', onTick(assetConfig, twilioSink, parsedNumbersToCall));
  }

  twilioSink.start()
  await coinbaseDatasource.start();
}

main()
  .catch(error => log.error(error));
