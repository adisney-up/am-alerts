'use strict';

const ethers = require('ethers');
const config = require('config');
const EthereumDatasource = require('../../../src/datasource/ethereum');

const logging = require('../../../src/logging');

const log = logging.consoleLogger();
const providerFactory = config.get('ethereum.providerFactory');
const provider = providerFactory(config.get('ethereum.providerKey'));
const ethereumDatasource = new EthereumDatasource(provider, log);

const alert = // Instantiate your alert

ethereumDatasource.start();
// start your alert
