import { testTransferAndRequest } from './web3-tests'
import { chainInfo } from './chaininfo.json'
const chainId = '97'

const config = {
  apiAddress: chainInfo[chainId].apiAddress,
  chainName: chainInfo[chainId].chainName,
  chainId: parseInt(chainId),
  provider: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  poll: 1000,
  fee: '1000000000000000000'
}

testTransferAndRequest(config)
