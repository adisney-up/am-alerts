'use strict';

module.exports = {
  log: {
    level: 'LOG_LEVEL',
  },
  alert: {
    priceThreshold: {
      sink: {
        twilio: {
          numbersToCall: 'ALERT_PRICE_THRESHOLD_SINK_TWILIO_NUMBERS_TO_CALL'
        }
      }
    }
  },
  sink: {
    pushover: {
      user: 'SINK_PUSHOVER_USER',
      token: 'SINK_PUSHOVER_TOKEN',
    },
    telegram: {
      apiToken: 'SINK_TELEGRAM_API_TOKEN',
      chatId: 'SINK_TELEGRAM_CHAT_ID',
    },
    twilio: {
      sid: 'SINK_TWILIO_SID',
      token: 'SINK_TWILIO_TOKEN',
      twilioNumber: 'SINK_TWILIO_TWILIO_NUMBER',
    }
  },
  ethereum: {
    providerKey: 'ETHEREUM_PROVIDER_KEY',
  }
};
