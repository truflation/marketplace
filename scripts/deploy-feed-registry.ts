// SPDX-License-Identifier: MIT
import { ethers } from "hardhat";
import { upgrades } from "hardhat";
import { TruflationFeedAdapter, TruflationFeedRegistry } from "../typechain";

async function main(): Promise<void> {
  const [owner] = await ethers.getSigners();
  console.log(`Deploying as owner ${owner.address}`)
  const TruflationFeedRegistry = await ethers.getContractFactory(
    "TruflationFeedRegistry"
  )
  const truflationFeedRegistry = await upgrades.deployProxy(
    TruflationFeedRegistry,
    [],
    { initializer: "initialize" }
  );
  await truflationFeedRegistry.waitForDeployment();
  console.log(
    "TruflationFeedRegistry deployed to:",
    await truflationFeedRegistry.getAddress()
  );
}

main();
