// SPDX-License-Identifier: MIT
import { ethers } from "hardhat";
import { upgrades } from "hardhat";
import { TfiFeedAdapter, TfiFeedRegistry } from "../typechain";

async function main(): Promise<void> {
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
}

main();
