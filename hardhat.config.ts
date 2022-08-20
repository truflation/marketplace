import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
	version: "0.6.6"
      },
      {
	version: "0.8.15"
      }
    ]
  }
};

export default config;
