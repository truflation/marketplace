// SPDX-License-Identifier: MIT
import TfiApi from 'tfi-api'
import { getConfig } from '../scripts/config'

const addresses = getConfig()
const hre = require('hardhat')

const config = {
  apiAddress: addresses.link.example,
  chainName: hre.network.name,
  chainId: parseInt(hre.network.config.chainId),
  provider: hre.network.config.url,
  poll: 1000,
  fee: '1000000000000000000'
}

function testTransferAndRequest (config): void {
  describe('Echo transfer call', async () => {
    let app, address, fee, account
    before(async function() {
      const [ account ] = await ethers.getSigners();
      app = new TfiApi.TfiApi(account.address)
      address = config.apiAddress
      fee = config.fee
    })

    it(`echo ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'echo',
        data: '1024',
        address,
        fee
      })
    }).timeout(20000)

    it(`echo/python ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'echo/python',
        data: '1024',
        address,
        fee
      })
    }).timeout(20000)

/*    it(`ipfs ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'echo',
        data: '1024',
        abi: 'ipfs',
        address,
        fee
      })
      assert.equal(r, 'ipfs:Qmbu2cd3sEGFxSmRXT8wmhsAc1mrAsX4xy9arnkQcQYkso')
    }).timeout(200000)

    it(`inflation ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'truflation/current',
        keypath: 'yearOverYearInflation',
        address,
        fee
      })
      const inflation = parseFloat(r)
      assert.equal(
        inflation >= -10.0 &&
        inflation < 50.0, true)
    }).timeout(200000)

    it(`uint ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'truflation/at-date',
        keypath: 'yearOverYearInflation',
        data: '{"location": "us", "date": "2022-10-01"}',
        abi: 'int256',
        multiplier: '1000000000000000000',
        address,
        fee
      })
      const inflation = parseFloat(r)
      assert.equal(
        inflation >= -10.0 &&
        inflation < 50.0, true)
    }).timeout(200000)

    it(`no string ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'truflation/at-date',
        keypath: 'yearOverYearInflation',
        data: { location: 'us', date: '2022-10-01' },
        abi: 'int256',
        multiplier: '1000000000000000000',
        address,
        fee
      })
      const inflation = parseFloat(r)
      assert.equal(
        inflation >= -10.0 &&
        inflation < 50.0, true)
    }).timeout(200000) */
  })
}

testTransferAndRequest(config)
