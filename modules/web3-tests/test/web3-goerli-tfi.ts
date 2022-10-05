import { testChain, testInflation } from './web3-tests'

const INFURA_API = process.env.INFURA_API ?? ''
const config = {
  apiAddress: '0xF4A440F09B52dCFCe0303BD81f457761cB008Bb4',
  chainName: 'Goerli',
  chainId: 5,
  provider: `wss://goerli.infura.io/ws/v3/${INFURA_API}`,
  poll: 1000
}

testInflation(config)
testChain(config)
