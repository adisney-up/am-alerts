# Asset Management Alerts

A framework for gathering and evaluating data from either the web or the Ethereum blockchain, sending alerts to multiple possible destinations.

## Running the app

`node apps/alerts/<app-dir>`

## Dependencies

- Alert configuration is done using the [config](https://www.npmjs.com/package/config) module.
- [ethers.js](https://docs.ethers.io/v5/api/) is the blockchain interaction lib.
- [jest](https://jestjs.io/docs/api) is the testing framework.
- Obtain a free api key from [alchemy](https://www.alchemyapi.io/) for the blockchain provider

## Task

1. Alert on any flash loan txn with a configurable minimum size.

  Alert contents:

  - Etherscan link in the alert
  - Amount and asset of loan
  - Protocol the loan originated from

  Lending protocols to support:

  - Aave
  - Compound
  - dYdX

  **Bonus:**

  - The name of any DeFi protocol the txn interacts with (other than the flash loan originator)

  Attention to [apps/alerts/flash-loan/index.js](apps/alerts/flash-loan/index.js)

2. Given a list of addresses, send an alert when:
  - Any txn of ETH or ERC20 is sent by the address
  - Over a configurable period of time if > some configurable notional is transferred

  Alert contents:

  - Address
  - Address identity or name, if given
  - Assets transferred
  - Amounts transferred
  - Destination address

  **Bonus:**

  - Report large txns for any address, not just configured ones

  Attention to [apps/alerts/flash-loan/index.js](apps/alerts/flash-loan/index.js)

Alerts should be sent to telegram using the credentials provided in [config/default.yaml](./config/default.yaml). Join the channel here: https://t.me/joinchat/Z6nnEcUf9ho5NTU5.

You may use the [LogSink](src/sink/log.js) to print alerts to stdout as an alternative to sending the alerts to telegram during testing and development.
