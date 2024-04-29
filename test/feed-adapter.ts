import { ethers, upgrades } from "hardhat";
import { TruflationFeedAdapter, TruflationFeedRegistry } from "../typechain";
const { expect } = require("chai");

let tfiFeedRegistry: any;
const registryKey = ethers.encodeBytes32String("testdata");

describe("TruflationFeedRegistry", () => {
  before(async () => {
    const TruflationFeedRegistry = await ethers.getContractFactory(
      "TruflationFeedRegistry"
    ) ;
    tfiFeedRegistry = await upgrades.deployProxy(TruflationFeedRegistry);
    await tfiFeedRegistry.waitForDeployment();
  });

  it("should set access permissions for a role, key, and address", async function () {
    const role = ethers.encodeBytes32String("role");
    const key = ethers.encodeBytes32String("key");
    const address = await (await ethers.getSigners())[1].getAddress();
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
      ethers.encodeBytes32String("set"),
      registryKey,
      await owner.getAddress(), true
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
      ethers.encodeBytes32String("get"),
      registryKey,
      await owner.getAddress(),
      true
    );
  });

  //test getRoundData
  it("should get the round data", async () => {
    const roundId = 1n;
    const answer = 12345n;
    const startedAt = 1234567890n;
    const updatedAt = 1234567890n;
    const answeredInRound = 1n;
    const [r, a, s, u, ar ] =   await tfiFeedRegistry.getRoundData(
      registryKey, roundId,  ethers.ZeroAddress
    );
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
    expect(u).to.equal(updatedAt);
    expect(ar).to.equal(answeredInRound);
  });

  //test latestRoundData
  it("should get the latest round data", async () => {
    const roundId = 1n;
    const answer = 12345n;
    const startedAt = 1234567890n;
    const updatedAt = 1234567890n;
    const answeredInRound = 1n;
    const [r, a, s, u, ar ] =   await tfiFeedRegistry.latestRoundData(
      registryKey, ethers.ZeroAddress
    );
    expect(r).to.equal(roundId);
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
    expect(u).to.equal(updatedAt);
    expect(ar).to.equal(answeredInRound);
  });
});

describe("TruflationFeedAdapter", () => {
  let tfiFeedAdapter:  any;

  before(async () => {
    const TruflationFeedAdapter = await ethers.getContractFactory(
      "TruflationFeedAdapter"
    );
    console.log(await tfiFeedRegistry.getAddress())
    tfiFeedAdapter = await upgrades.deployProxy(
      TruflationFeedAdapter,
      [await tfiFeedRegistry.getAddress(), registryKey]
    );
    tfiFeedRegistry.setAccess(
      ethers.encodeBytes32String("proxy"),
      registryKey,
      await tfiFeedAdapter.getAddress(),
      true
    );
    await tfiFeedAdapter.waitForDeployment();
  });
  // test latestRoundData
  it("should get the latest round data", async () => {
    const roundId = 1n;
    const answer = 12345n;
    const startedAt = 1234567890n;
    const updatedAt = 1234567890n;
    const answeredInRound = 1n;
    const [r,  a, s, u, ar ] =   await tfiFeedAdapter.latestRoundData();

    // check return values
    expect(r).to.equal(roundId);
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
    expect(u).to.equal(updatedAt);
    expect(ar).to.equal(answeredInRound);
    });

});

