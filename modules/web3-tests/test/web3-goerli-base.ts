import { testChain } from './web3-tests'

const INFURA_API = process.env.INFURA_API

testChain({
  apiAddress: '0xcb57ED564dEe9BDdF830353C8C3a09A60cBB7278',
  chainName: 'Goerli',
  chainId: 5,
  provider: `wss://goerli.infura.io/ws/v3/${INFURA_API}`,
  poll: 1000
})
