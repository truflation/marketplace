import { testTransferAndRequest } from './web3-tests'
import { chainInfo } from './chaininfo.json'
const chainId = '43113'

const config = {
  apiAddress: chainInfo[chainId].apiAddress,
  chainName: chainInfo[chainId].chainName,
  chainId: parseInt(chainId),
  provider: 'https://api.avax-test.network/ext/bc/C/rpc',
  poll: 1000,
  fee: '1000000000000000000'
}

testTransferAndRequest(config)
