import { testTransferAndRequest } from './web3-tests'
import { chainInfo } from './chaininfo.json'
const chainId = '4002'

const config = {
  apiAddress: chainInfo[chainId].apiAddress,
  chainName: chainInfo[chainId].chainName,
  chainId: parseInt(chainId),
  provider: 'https://fantom-testnet.public.blastapi.io/',
  poll: 1000,
  fee: '1000000000000000000'
}

testTransferAndRequest(config)
