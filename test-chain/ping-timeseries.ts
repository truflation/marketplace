// SPDX-License-Identifier: MIT

/*
  This is a mocha file that accesses Truflation
  time series data.

  A list of data ids is available in docs/data-ids.csv
  and a list of type values is located in docs/typeof.csv

  To run this file set up your .env with the your private
  key and the API endpoints for hardhat.config.ts

  and run

  yarn install

  npx hardhat test --network <network name> scripts/ping-timeseriees.ts

*/


import TfiApi from 'tfi-api'
import { getConfig } from '../scripts/config'

const addresses = getConfig()
const hre = require('hardhat')

const config = {
  apiAddress: addresses.link.example,
  chainName: hre.network.name,
  chainId: parseInt(hre.network.config.chainId),
  provider: hre.network.config.url,
  poll: hre.network.tfi_api_poll ?? 0,
  fee: '1000000000000000000'
}

function testTimeSeries (config): void {
  describe('Time series', async () => {
    let app, address, fee, account
    before(async function() {
      const [ account ] = await ethers.getSigners();
      app = new TfiApi.TfiApi(account.address)
      address = config.apiAddress
      fee = config.fee
    })

    it(`echo ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
	service: 'truflation/series',
	data: { ids: '603', types: '114', date: '2022-10-04' },
	keypath: 'result.0.1.0',
        address,
        fee
      })
    }).timeout(20000)

    it(`echo/python ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
	service: 'truflation/series',
	data: { ids: '603', types: '114' },
	keypath: 'result.0.1.0',
        address,
        fee
      })
    }).timeout(20000)
  })
}

testTimeSeries(config)
