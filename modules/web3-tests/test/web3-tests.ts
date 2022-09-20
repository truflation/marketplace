import TfiApi from 'tfi-api'
import Web3 from 'web3'
import assert from 'assert'
import HDWalletProvider from '@truffle/hdwallet-provider'

require('dotenv').config()

function getWeb3 (config) {
  const provider = new HDWalletProvider({
    privateKeys: [process.env.PRIVATE_KEY],
    providerOrUrl: config.provider
  })
  return new Web3(provider)
}

const account = process.env.WALLET_ADDRESS

export function testChain (config) {
  describe('My function', function () {
    let app, web3, address
    before(() => {
      app = new TfiApi.TfiApi(account)
      web3 = getWeb3(config)
      address = config.apiAddress
    })

    it('test assert', function () {
      assert.equal(1, 1)
    })

    /*    it(`hello world ${config.chainName}`, async () => {
      app.doApiRequest(web3, {
        address
      })
    }).timeout(200000) */

    it(`echo ${config.chainName}`, async () => {
      const r = await app.doApiRequest(web3, {
        service: 'echo',
        data: '1024',
        address
      })
      assert.equal(r, 1024)
    }).timeout(200000)
  })
}

export function testInflation (config) {
  describe('My function', function () {
    let app, web3, address
    before(() => {
      app = new TfiApi.TfiApi(account)
      web3 = getWeb3(config)
      address = config.apiAddress
    })
    it(`echo ${config.chainName}`, async () => {
      const r = await app.doApiRequest(web3, {
        service: 'truflation/current',
	keypath: 'yearOverYearInflation',
        address
      })
      const inflation = parseFloat(r)
      assert.equal(
        inflation >= -10.0 &&
        inflation < 50.0, true)
    }).timeout(200000)
  })
}
