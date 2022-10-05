import { testTransferAndRequest } from './web3-tests'
import { chainInfo } from './chaininfo.json'
const INFURA_API = process.env.INFURA_API ?? ''
const chainId = '5'

const config = {
  apiAddress: chainInfo[chainId].apiAddress,
  chainName: chainInfo[chainId].chainName,
  chainId: parseInt(chainId),
  provider: `wss://goerli.infura.io/ws/v3/${INFURA_API}`,
  poll: 1000,
  fee: '1000000000000000000'
}

testTransferAndRequest(config)
