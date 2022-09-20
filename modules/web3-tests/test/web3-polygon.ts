import { testChain } from './web3-tests'

testChain({
  apiAddress: '0x860c0901612d581420837406A574ae79ef552EF1',
  chainName: 'Polygon Mumbai',
  chainId: 80001,
  provider: 'https://rpc-mumbai.maticvigil.com/',
  testnet: true,
  poll: 1000
})
