const ethers = require('ethers');
const Decimal = require('decimal.js');

module.exports = {
  alert: {
    lowGas: {
      datasource: {
        gasnow: {
          url: 'https://www.gasnow.org/api/v3/gas/price',
          interval: 30000,
          windowSize: 10
        }
      },
      gasThreshold: ethers.utils.parseUnits('300', 'gwei'),
    },
    priceThreshold: {
      assets: [
        { name: 'BAL', message: 'Bee Ayy El is through first price threshold. Current price is #REPLACE#', price: new Decimal(60) },
        { name: 'BAL', message: 'Bee Ayy El is thorugh panic price threshold. Current price is #REPLACE#', price: new Decimal(65) },
      ],
      datasource: {
        coinbase: {
          url: 'https://api.pro.coinbase.com/products/BAL-USD/ticker',
          interval: 10000,
          staleMultiplier: 3,
        }
      },
      sink: {
        twilio: {
          numbersToCall: [],
        }
      }
    },
    bancorPoolThreshold: {
      contracts: {
        vBntBntPool: {
          name: 'vBntBntPool',
          address: '0x3d9e2da44af9386484d0d35c29eb62122e4f4742',
        }
      }
    }
  },
  sink: {
    pushover: {},
    telegram: {
      apiToken: '1770030702:AAHo_lm7uPBy11n5HG8mJoxilJ8YshLJdYM',
      chatId: '-586564665',
    },
    twilio: {
      twilioNumber: '',
    },
  },
  ethereum: {
    providerFactory: (key) => {
      return ethers.providers.AlchemyProvider.getWebSocketProvider('mainnet', key);
    },
    providerKey: 'TODO',
  },
};
