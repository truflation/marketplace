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

  const TruflationFeedAdapter = await ethers.getContractFactory(
    "TruflationFeedAdapter"
  )
  const truflationFeedAdapter = await upgrades.deployProxy(
    TruflationFeedAdapter,
    [await truflationFeedRegistry.getAddress(),
     ethers.encodeBytes32String("truflation.cpi.us")
    ],
    { initializer: "initialize" }
  );

  await truflationFeedAdapter.waitForDeployment();
  console.log(
    "TruflationFeedAdapter deployed to:",
    await truflationFeedAdapter.getAddress()
  );

  const getKey = ethers.encodeBytes32String("get");
  const setKey = ethers.encodeBytes32String("set");
  const proxyKey = ethers.encodeBytes32String("proxy");
  const key = ethers.encodeBytes32String("truflation.cpi.us");
  await truflationFeedRegistry.setAccess(
    proxyKey, key, await truflationFeedAdapter.getAddress(), true
  );
  await truflationFeedRegistry.setAccess(
    getKey, key, owner.address, true
  );
  await truflationFeedRegistry.setAccess(
    setKey, key, owner.address, true
  );

  console.log("Roles granted");
}

main();
