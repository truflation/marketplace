import { testChain } from './web3-tests'

const INFURA_API = process.env.INFURA_API

testChain({
  apiAddress: '0x56d04066e9A76ea53505ff2FC90171160212B7A8',
  chainName: 'Goerli',
  chainId: 5,
  provider: `wss://goerli.infura.io/ws/v3/${INFURA_API}`,
  poll: 1000
})
