import { ethers, upgrades } from "hardhat";
import { TfiFeedAdapter, TfiFeedRegistry } from "../typechain";
const { expect } = require("chai");

let tfiFeedRegistry: any;
const registryKey = ethers.utils.formatBytes32String("testdata");

describe("TfiFeedRegistry", () => {
  before(async () => {
    const TfiFeedRegistry = await ethers.getContractFactory(
      "TfiFeedRegistry"
    ) ;
    tfiFeedRegistry = await upgrades.deployProxy(TfiFeedRegistry);
    await tfiFeedRegistry.deployed();
  });

// test grantRole 
  it("should grant the role to the deployer", async () => { 
    // get my address
    const [owner] = await ethers.getSigners();
    await tfiFeedRegistry.grantRoleForKey(
      ethers.utils.formatBytes32String("set"),
      registryKey,
      owner.address);
  });

  // test setRoundData
  it("should set the round data", async () => {
    const roundId = 1;
    const answer = 12345;
    const startedAt = 1234567890;
    const updatedAt = 1234567890;
    const answeredInRound = 1;
    await tfiFeedRegistry.setRoundData(
      registryKey,
      roundId,
      answer,
      startedAt,
      updatedAt
    )
  }); 

  //test grantRole with key "get"
  it("should grant the role to the deployer", async () => {
    const [owner] = await ethers.getSigners();
    await tfiFeedRegistry.grantRoleForKey(
      ethers.utils.formatBytes32String("get"),
      registryKey,
      owner.address);
  });

  //test latestRoundData
  it("should get the latest round data", async () => {
    const roundId = 1;
    const answer = 12345;
    const startedAt = 1234567890;
    const updatedAt = 1234567890;
    const answeredInRound = 1;
    const [r, a, s, u, ar ] =   await tfiFeedRegistry.latestRoundData(
      registryKey, ethers.constants.AddressZero
    );
    expect(r).to.equal(roundId);
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
    expect(u).to.equal(updatedAt);
    expect(ar).to.equal(answeredInRound);
  });
});

describe("TfiFeedAdapter", () => {
  let tfiFeedAdapter:  any;

  before(async () => {
    const TfiFeedAdapter = await ethers.getContractFactory(
      "TfiFeedAdapter"
    );
    console.log(tfiFeedRegistry.address)
    tfiFeedAdapter = await upgrades.deployProxy(
      TfiFeedAdapter,
      [tfiFeedRegistry.address, registryKey]
    );
    tfiFeedRegistry.grantRoleForKey(
      ethers.utils.formatBytes32String("proxy"),
      registryKey,
      tfiFeedAdapter.address
    );
    await tfiFeedAdapter.deployed();
  });
  // test latestRoundData
  it("should get the latest round data", async () => {
    const roundId = 1;
    const answer = 12345;
    const startedAt = 1234567890;
    const updatedAt = 1234567890;
    const answeredInRound = 1;
    const a1 = await tfiFeedAdapter.roleId(registryKey);
    const [r,  a, s, u, ar ] =   await tfiFeedAdapter.latestRoundData();

    // check return values
    expect(r).to.equal(roundId);
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
    expect(u).to.equal(updatedAt);
    expect(ar).to.equal(answeredInRound);
    });
    
});

