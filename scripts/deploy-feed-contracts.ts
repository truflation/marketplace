// SPDX-License-Identifier: MIT
import { ethers } from "hardhat";
import { upgrades } from "hardhat";
import { TfiFeedAdapter, TfiFeedRegistry } from "../typechain";

async function main(): Promise<void> {
  const [owner] = await ethers.getSigners();
  console.log(`Deploying as owner ${owner.address}`)
  const TfiFeedRegistry = await ethers.getContractFactory(
    "TfiFeedRegistry"
  ) as TfiFeedRegistry__factory;
  const tfiFeedRegistry = await upgrades.deployProxy(
    TfiFeedRegistry,
    [],
    { initializer: "initialize" }
  );
  await tfiFeedRegistry.waitForDeployment();
  console.log("TfiFeedRegistry deployed to:", await tfiFeedRegistry.getAddress());

  const TfiFeedAdapter = await ethers.getContractFactory(
    "TfiFeedAdapter"
  ) as TfiFeedAdapter__factory;
  const tfiFeedAdapter = await upgrades.deployProxy(
    TfiFeedAdapter,
    [await tfiFeedRegistry.getAddress(),
     ethers.encodeBytes32String("truflation.cpi.us")
    ],
    { initializer: "initialize" }
  );
  await tfiFeedAdapter.waitForDeployment();
  console.log("TfiFeedAdapter deployed to:", await tfiFeedAdapter.getAddress());

  const getKey = ethers.encodeBytes32String("get");
  const setKey = ethers.encodeBytes32String("set");
  const proxyKey = ethers.encodeBytes32String("proxy");
  const key = ethers.encodeBytes32String("truflation.cpi.us");
  await tfiFeedRegistry.setAccess(
    getKey, key, await tfiFeedAdapter.getAddress(), true
  );
  await tfiFeedRegistry.setAccess(
    getKey, key, owner.address, true
  );
  await tfiFeedRegistry.setAccess(
    setKey, key, owner.address, true
  );

  console.log("Roles granted");
}

main();
