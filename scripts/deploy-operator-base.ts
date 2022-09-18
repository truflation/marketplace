// deploy baseline operator with tfitokens

import { ethers } from "hardhat";
import { address } from "./config";

async function main() {
  const name = 'Operator'
  const contract = await ethers.getContractFactory('Operator');
  const inst = await contract.deploy(
    address.token,
    address.owner
  );
  
  await inst.deployed();
  console.log(`${name} deployed to ${inst.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
