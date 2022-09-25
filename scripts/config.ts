import hre from 'hardhat'

// see token addresses for the meaning of these addresses

const testnetOwner = '0x968E88df55AcAeC002e3d7c2393F9742e40d94b9'
export const addressesByChain = {
  1: {
    token_link: '0x514910771AF9Ca656af840dff83E8264EcF986CA'
  },
  5: {
    token_tfi: '0x3417dd955d4408638870723B9Ad8Aae81953B478',
    owner: testnetOwner,
    operator_baseline: '0x7C2e0E489493e487903941F399A0255C4c170C91',
    jobid_baseline: 'cef7d7ad405e45eb91e2da0f415c920e',
    client_baseline: '0xcb57ED564dEe9BDdF830353C8C3a09A60cBB7278',
    jobid_new_pipeline: '5db955dabd334024861406858e1fbbe2',
    operator_tfi: '0x394fdd656749CCCcc21280BBDF6CC209745f4d0D',
    jobid_tfi: '2868d2f92fdc4c9abd6437eb016ab772',
    example_tfi: '0xF4A440F09B52dCFCe0303BD81f457761cB008Bb4',
    token_link: '0x326c977e6efc84e512bb9c30f76e30c160ed06fb',
    operator_link: '0x6888BdA6a975eCbACc3ba69CA2c80d7d7da5A344',
    jobid_link: 'd220e5e687884462909a03021385b7ae',
    example_link: '0x0edBa69e2aE5C668a46360964f8a0b402359F2E0'
  },
  56: { // BNB mainnet
    token_link: '0x404460c6a5ede2d891e8297795264fde62adbb75'
  },
  97: { // BNB testnet
    token_link: '0x84b9b910527ad5c03a9ca831909e21e236ea7b06',
    owner: testnetOwner
  },
  137: { // polygon mainnet
    token_link: '0xb0897686c545045afc77cf20ec7a532e3120e0f1'
  },
  80001: { // polygon (mumbai) testnet
    token_link: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    owner: testnetOwner
  },
  43114: { // avalanche mainnet
    token_link: '0x5947BB275c521040051D82396192181b413227A3'
  },
  43113: { // fuji testnet
    token_link: '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846',
    owner: testnetOwner
  }
}

export const address = addressesByChain[5]

export function getConfig (): any {
  const networkName = hre.network.name
  const chainId = hre.network.config.chainId
  console.log('Network name=', networkName)
  console.log('Network chain id=', chainId)

  return addressesByChain[chainId]
}
