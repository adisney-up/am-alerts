'use strict';

/**
 * Module dependencies.
 */

const twilio = require('twilio')

class TwilioSink {
  constructor({ sid, token, twilioNumber } = {}) {
    this.sid = sid;
    this.token = token;
    this.twilioNumber = twilioNumber;
  }

  start() {
    this.client = twilio(this.sid, this.token);
  }

  async send(numberToCall, message='An alert has been triggered') {
    const response = new twilio.twiml.VoiceResponse();

    response.pause({ length: 2 })
    response.say(message);
    response.pause({ length: 3 })
    response.say(message);
    response.pause({ length: 3 })
    response.say(message);
    response.pause({ length: 3 })

    const call = await this.client.calls.create({
      twiml: response.toString(),
      to: numberToCall,
      from: this.twilioNumber,
    });
  }
}

/**
 * Module exports.
 */

module.exports = TwilioSink;
