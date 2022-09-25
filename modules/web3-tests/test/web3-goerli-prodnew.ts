import { testChain, testInflation, testTransferAndRequest } from './web3-tests'

const INFURA_API = process.env.INFURA_API
const config = {
  apiAddress: '0x0edBa69e2aE5C668a46360964f8a0b402359F2E0',
  chainName: 'Goerli',
  chainId: 5,
  provider: `wss://goerli.infura.io/ws/v3/${INFURA_API}`,
  poll: 1000,
  fee: '1000000000000000000'
}

testTransferAndRequest(config)


