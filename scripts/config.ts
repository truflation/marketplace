const { ethers } = require("hardhat");
import hre from 'hardhat';

// see token addresses for the meaning of these addresses

export const addressesByChain = {
  5: {
    token_tfi: '0x3417dd955d4408638870723B9Ad8Aae81953B478',
    owner: '0x968E88df55AcAeC002e3d7c2393F9742e40d94b9',
    operator_baseline: '0x7C2e0E489493e487903941F399A0255C4c170C91',
    jobid_baseline: 'cef7d7ad405e45eb91e2da0f415c920e',
    client_baseline: '0xcb57ED564dEe9BDdF830353C8C3a09A60cBB7278',
    jobid_new_pipeline: '5db955dabd334024861406858e1fbbe2',
    operator_tfi: '0x394fdd656749CCCcc21280BBDF6CC209745f4d0D',
    jobid_tfi: '2868d2f92fdc4c9abd6437eb016ab772',
    example_tfi: '0xF4A440F09B52dCFCe0303BD81f457761cB008Bb4',
    token_link: '0x326c977e6efc84e512bb9c30f76e30c160ed06fb',
    operator_link: '0x6888BdA6a975eCbACc3ba69CA2c80d7d7da5A344',
  }
}

export const address = addressesByChain[5]

export function getConfig() {
  const networkName = hre.network.name
  const chainId = hre.network.config.chainId
  console.log("Network name=", networkName);
  console.log("Network chain id=", chainId);

  return addressesByChain[chainId];
}
