import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'

import * as dotenv from 'dotenv'
dotenv.config()

const INFURA_API_KEY = process.env.INFURA_API_KEY ?? ''
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY ?? ''
const TESTNET_PRIVATE_KEY = process.env.TESTNET_PRIVATE_KEY ?? ''
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? ''
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY ?? ''

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.7.0',
      },
      {
        version: '0.8.15',
      },
      {
        version: '0.4.24',
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [MAINNET_PRIVATE_KEY],
    },
    bsc: {
      chainId: 56,
      url: 'https://bsc-dataseed.binance.org/',
      accounts: [MAINNET_PRIVATE_KEY],
    },
    polygon: {
      chainId: 137,
      url: 'https://polygon-rpc.com',
      accounts: [MAINNET_PRIVATE_KEY],
    },
    avalanche: {
      chainId: 43114,
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts: [MAINNET_PRIVATE_KEY],
    },
    goerli: {
      chainId: 5,
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [TESTNET_PRIVATE_KEY],
    },
    bscTestnet: {
      chainId: 97,
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      accounts: [TESTNET_PRIVATE_KEY],
    },
    polygonMumbai: {
      chainId: 80001,
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [TESTNET_PRIVATE_KEY],
    },
    avalancheFujiTestnet: {
      chainId: 43113,
      url: 'https://api.avax.network/ext/bc/C/rpc',
      accounts: [TESTNET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      bsc: BSCSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      avalanche: SNOWTRACE_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      bscTestnet: BSCSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
      avalancheFujiTestnet: SNOWTRACE_API_KEY
    },
  },
}

export default config
