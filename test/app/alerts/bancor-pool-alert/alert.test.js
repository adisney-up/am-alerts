'use strict';

/**
 * Module dependencies.
 */

const ethers = require('ethers');
const { BigNumber } = require('ethers');
const EthereumDatasource = require('src/datasource/ethereum');
const config = require('config');

const BancorPoolThresholdAlert = require('app/alerts/bancor-pool-alert/alert');

/**
 * Test 'TestBancorPoolThreshold'.
 */

describe('TestBancorPoolThreshold', () => {
  const liquidityProtectionAddress = '0xeead394A017b8428E2D5a976a054F303F78f3c0C';
  const liquidityProtectionAbi = [{ name: 'poolAvailableSpace' }];
  const { name: poolName, address: poolAddress } = config.get('alert.bancorPoolThreshold.contracts.vBntBntPool');

  let contract;
  let sink;
  let provider;
  let ethereumDatasource;
  let log;
  let alert;

  beforeEach(() => {
    log = { info: jest.fn(), debug: jest.fn() };

    ethereumDatasource = new EthereumDatasource();
    jest.spyOn(ethereumDatasource, 'on');

    provider = { 'ethers': 'provider' };
    contract = { protection: 'contract', poolAvailableSpace: jest.fn() };
    sink = { send: jest.fn() };

    alert = new BancorPoolThresholdAlert(ethereumDatasource, sink, contract, log);
  });

  describe('constructor', () => {
    it('should get an ethereum datasource', () => {
      expect(alert.ethereumDatasource).toEqual(ethereumDatasource);
    });

    it('should set the sink', () => {
      expect(alert.sink).toEqual(sink);
    });

    it('should set the liquidityProtection contract', () => {
      expect(alert.liquidityProtectionContract).toEqual(contract);
    });

    it('should set the log', () => {
      expect(alert.log).toEqual(log);
    });

    it('should set the poolAddress', () => {
      expect(alert.poolAddress).toEqual(poolAddress);
    });

    it('should set the poolName', () => {
      expect(alert.poolName).toEqual(poolName);
    });
  });

  describe('start', () => {
    it('subscribe to the `tick` event on the ethereumDatasource', () => {
      const boundTick = jest.fn();
      jest.spyOn(alert.tick, 'bind').mockReturnValue(boundTick);

      alert.start();

      expect(ethereumDatasource.on).toHaveBeenCalledWith('tick', expect.any(Function));
    });
  });

  describe('tick', () => {
    const vBntAvailable = BigNumber.from(100);
    const anyNumber = 0;

    beforeEach(() => {
      contract.poolAvailableSpace.mockResolvedValue([vBntAvailable, anyNumber]);
    });

    it('should call `contract.poolAvailableSpace`', async () => {
      await alert.tick()

      expect(alert.liquidityProtectionContract.poolAvailableSpace).toHaveBeenCalledWith(poolAddress);
    });

    it('should set lastAvailableSpace', async () => {
      await alert.tick()

      expect(alert.lastAvailableSpace).toEqual(vBntAvailable);
    });

    it('should not send an alert when available space has not changed', async () => {
      await alert.tick()

      expect(sink.send).not.toHaveBeenCalled();
    });

    it('should send an alert when available space has changed', async () => {
      contract.poolAvailableSpace.mockResolvedValueOnce([BigNumber.from(100), anyNumber]).mockResolvedValueOnce([BigNumber.from(10), anyNumber]);

      await alert.tick();
      await alert.tick();

      expect(sink.send).toHaveBeenCalledWith('vBntBntPool available space changed from 100 to 10. Change of 90.');
    });

    it('should send an alert when available space has changed', async () => {
      contract.poolAvailableSpace.mockResolvedValueOnce([BigNumber.from(1), anyNumber]).mockResolvedValueOnce([BigNumber.from(1), anyNumber]);

      await alert.tick();
      await alert.tick();

      expect(sink.send).not.toHaveBeenCalled();
    });
  });

  describe('hasAvailableSpaceChanged', () => {
    const vBntAvailable = BigNumber.from(100);
    const anyNumber = 0;

    beforeEach(() => {
      contract.poolAvailableSpace.mockResolvedValue([vBntAvailable, anyNumber]);
    });

    it('should return false when no previous value for available space', () => {
      expect(alert.hasAvailableSpaceChanged(BigNumber.from(10000))).toEqual(false);
    });

    it('should return false when available space hasn\'t changed', () => {
      const newAvailableSpace = vBntAvailable;
      alert.lastAvailableSpace = BigNumber.from(100);

      expect(alert.hasAvailableSpaceChanged(newAvailableSpace)).toEqual(false);
    });

    it('should return true when available space different from `lastAvailableSpace`', () => {
      const newAvailableSpace = BigNumber.from(10);
      alert.lastAvailableSpace = BigNumber.from(100);

      expect(alert.hasAvailableSpaceChanged(newAvailableSpace)).toEqual(true);
    });
  });
});
