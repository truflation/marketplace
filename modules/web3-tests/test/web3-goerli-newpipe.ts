import { testChain, testInflation } from './web3-tests'

const INFURA_API = process.env.INFURA_API
const config = {
  apiAddress: '0x2aBeB7AFC86612A6D9A1727aBc677270adc2422a',
  chainName: 'Goerli',
  chainId: 5,
  provider: `wss://goerli.infura.io/ws/v3/${INFURA_API}`,
  poll: 1000
}

testInflation(config)
testChain(config)

