import { testChain } from './web3-tests'

testChain({
  apiAddress: '0x860c0901612d581420837406A574ae79ef552EF1',
  chainName: 'BSC Testnet',
  chainId: 97,
  provider: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  poll: 1000
})
