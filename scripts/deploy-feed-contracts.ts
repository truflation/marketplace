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
  await tfiFeedRegistry.deployed();
  console.log("TfiFeedRegistry deployed to:", tfiFeedRegistry.address);

  const TfiFeedAdapter = await ethers.getContractFactory(
    "TfiFeedAdapter"
  ) as TfiFeedAdapter__factory;
  const tfiFeedAdapter = await upgrades.deployProxy(
    TfiFeedAdapter,
    [tfiFeedRegistry.address,
     ethers.utils.formatBytes32String("truflation.cpi.us")
    ],
    { initializer: "initialize" }
  );
  await tfiFeedAdapter.deployed();
  console.log("TfiFeedAdapter deployed to:", tfiFeedAdapter.address);

  const getKey = ethers.utils.formatBytes32String("get");
  const setKey = ethers.utils.formatBytes32String("set");
  const proxyKey = ethers.utils.formatBytes32String("proxy");
  const key = ethers.utils.formatBytes32String("truflation.cpi.us");
  await tfiFeedRegistry.setAccess(
    proxyKey, key, tfiFeedAdapter.address, true
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
