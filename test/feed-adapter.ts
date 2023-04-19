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

  it("should set access permissions for a role, key, and address", async function () {
    const role = ethers.utils.formatBytes32String("role");
    const key = ethers.utils.formatBytes32String("key");
    const address = await (await ethers.getSigner(1)).getAddress();
    const value = true;

    await expect(
      tfiFeedRegistry.setAccess(role, key, address, value)
    ).to.emit(tfiFeedRegistry, "AccessSet").withArgs(
      role, key, address, value
    );
  });

  // test grantRole
  it("should grant the role to the deployer", async () => {
    // get my address
    const [owner] = await ethers.getSigners();
    await tfiFeedRegistry.setAccess(
      ethers.utils.formatBytes32String("set"),
      registryKey,
      owner.address, true
    );
  });

  // test setRoundData
  it("should set the round data", async () => {
    const roundId = 1;
    const answer = 12345;
    const startedAt = 1234567890;
    const updatedAt = 1234567890;
    const answeredInRound = 1;
    await expect(
      tfiFeedRegistry.setRoundData(
	registryKey,
	roundId,
	answer,
	startedAt,
	updatedAt
      )
    ).to.emit(tfiFeedRegistry, "RoundDataSet").withArgs(
      registryKey, roundId, answer, startedAt, updatedAt
    );
  });

  //test grantRole with key "get"
  it("should grant the role to the deployer", async () => {
    const [owner] = await ethers.getSigners();
    await tfiFeedRegistry.setAccess(
      ethers.utils.formatBytes32String("get"),
      registryKey,
      owner.address,
      true
    );
  });

  //test getRoundData
  it("should get the round data", async () => {
    const roundId = 1;
    const answer = 12345;
    const startedAt = 1234567890;
    const updatedAt = 1234567890;
    const answeredInRound = 1;
    const [r, a, s, u, ar ] =   await tfiFeedRegistry.getRoundData(
      registryKey, roundId,  ethers.constants.AddressZero
    );
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
    expect(u).to.equal(updatedAt);
    expect(ar).to.equal(answeredInRound);
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
    tfiFeedRegistry.setAccess(
      ethers.utils.formatBytes32String("proxy"),
      registryKey,
      tfiFeedAdapter.address,
      true
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
    const [r,  a, s, u, ar ] =   await tfiFeedAdapter.latestRoundData();

    // check return values
    expect(r).to.equal(roundId);
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
    expect(u).to.equal(updatedAt);
    expect(ar).to.equal(answeredInRound);
    });

});

