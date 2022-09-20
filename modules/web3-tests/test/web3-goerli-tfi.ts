import { testChain, testInflation } from './web3-tests'

const INFURA_API = process.env.INFURA_API
const config = {
  apiAddress: '0xe33D680ddba7e36c2055d923FEc4fb88F6c9151D',
  chainName: 'Goerli',
  chainId: 5,
  provider: `wss://goerli.infura.io/ws/v3/${INFURA_API}`,
  poll: 1000
}

testInflation(config)
testChain(config)

