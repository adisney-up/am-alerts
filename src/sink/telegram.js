'use strict';

/**
 * Module dependencies.
 */

const got = require('got');

class TelegramSink {
  constructor({ apiToken, chatId, apiRoot = 'https://api.telegram.org' } = {}) {
    this.apiToken = apiToken;
    this.chatId = chatId;
    this.apiRoot = apiRoot;
  }

  send(message) {
    got.post(`${this.apiRoot}/bot${this.apiToken}/sendMessage`, { json: { 'chat_id': this.chatId, text: message } });
  }
}

/**
 * Module exports.
 */

module.exports = TelegramSink;
