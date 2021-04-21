'use strict';

const EthereumDatasource = require('src/datasource/ethereum');

describe('TestEthereumDatasource', () => {
  const provider = { 'provider': 'mock', on: jest.fn() };

  let log;
  let datasource;

  beforeEach(() => {
    log = { debug: jest.fn()};

    datasource = new EthereumDatasource(provider, log);
  });

  describe('constructor', () => {
    it('should set the provider', () => {
      expect(datasource.provider).toEqual(provider);
    });
  });

  describe('start', () => {
    it('should make ethers block subscription', () => {
      const boundTick = {'tick': 'bound'};
      jest.spyOn(datasource.tick, 'bind').mockReturnValue(boundTick);

      datasource.start();

      expect(provider.on).toHaveBeenCalledWith('block', boundTick);
    });
  });

  describe('tick', () => {
    const blockHeight = 123456;

    it('should emit the `tick` event with block height', () => {
      jest.spyOn(datasource, 'emit');

      datasource.tick(blockHeight);

      expect(datasource.emit).toHaveBeenCalledWith('tick', blockHeight);
    });
  });
});
