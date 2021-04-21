'use strict';

const fs = require('fs');
const ethers = require('ethers');
const config = require('config');

const logging = require('../../../src/logging');

const log = logging.consoleLogger();

const EthereumDatasource = require('../../../src/datasource/ethereum');
const TelegramSink = require('../../../src/sink/telegram');
const LogSink = require('../../../src/sink/log');

const BancorPoolThresholdAlert = require('./alert');

const providerFactory = config.get('ethereum.providerFactory');
const provider = providerFactory(config.get('ethereum.providerKey'));
const liquidityProtectionAbi = JSON.parse(fs.readFileSync('data/abis/bancor/liquidityProtection.json').toString())
const liquidityProtectionAddress = '0xeead394A017b8428E2D5a976a054F303F78f3c0C';
const liquidityProtectionContract = new ethers.Contract(liquidityProtectionAddress, liquidityProtectionAbi, provider);

const ethereumDatasource = new EthereumDatasource(provider, log);
const sink = new TelegramSink();

const alert = new BancorPoolThresholdAlert(ethereumDatasource, sink, liquidityProtectionContract, log);

ethereumDatasource.start();
alert.start()
