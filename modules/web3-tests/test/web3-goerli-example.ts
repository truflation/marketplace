import { testChain } from './web3-tests'

const INFURA_API = process.env.INFURA_API

testChain({
  apiAddress: '0x0fdA8395FEd5bc9F0e79a0AAE6269409b1A7dDc3',
  chainName: 'Goerli',
  chainId: 5,
  provider: `wss://goerli.infura.io/ws/v3/${INFURA_API}`,
  poll: 1000
})
