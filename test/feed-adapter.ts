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
  // test
  it('should throw exeception access denied', async () => {
     const [owner] = await ethers.getSigners();
     await expect(tfiFeedRegistry.latestRoundData(
	registryKey, await owner.getAddress()
      )).to.be.revertedWith(
      'Access denied'
      )
  })

  // test grantRole
  it("grant role get", async () => {
    // get my address
    const [owner] = await ethers.getSigners();
    await tfiFeedRegistry.setAccess(
      ethers.encodeBytes32String("get"),
      registryKey,
      await owner.getAddress(), true
    );
  });

  // test no data
  it('test no data', async () => {
     const [owner] = await ethers.getSigners();
     await expect(tfiFeedRegistry.latestRoundData(
	registryKey, await owner.getAddress()
      )).to.be.revertedWith(
      'no data'
      )
  })

  // test setRoundData
  it("should set the round data array", async () => {
    const roundId = [1, 1, 1];
    const answer = [12345, 1, 1];
    const startedAt = [1, 2, 3];
    const updatedAt = [1, 2, 3];
    const answeredInRound = [1, 1, 1];
    await expect(
      tfiFeedRegistry.setRoundDataFromArray(
	[registryKey, registryKey, registryKey],
	answer,
	startedAt,
      )
    )
  });

  // test setRoundData
  it("should set the round data", async () => {
    const answer = 12345;
    const startedAt = 1234567890;
    await expect(
      tfiFeedRegistry.setRoundData(
	registryKey,
	answer,
	startedAt
      )
    )
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
    const roundId = 4n;
    const answer = 12345n;
    const startedAt = 1234567890n;
    const updatedAt = 1n;
    const answeredInRound = 4n;
    const [r, a, s, u, ar ] =   await tfiFeedRegistry.getRoundData(
      registryKey, roundId,  ethers.ZeroAddress
    );
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
    expect(ar).to.equal(answeredInRound);
  });

  //test getRoundData
  it("out of bounds low", async () => {
    const roundId = 0n;
    await expect(tfiFeedRegistry.getRoundData(
      registryKey, roundId,  ethers.ZeroAddress
    )).to.be.revertedWith(
    'out of bounds')
  });

  //test getRoundData
  it("out of bounds high", async () => {
    const roundId = 6n;
    await expect(tfiFeedRegistry.getRoundData(
      registryKey, roundId,  ethers.ZeroAddress
    )).to.be.revertedWith(
    'out of bounds')
  });

  //test latestRoundData
  it("should get the latest round data", async () => {
    const roundId = 4n;
    const answer = 12345n;
    const startedAt = 1234567890n;
    const updatedAt = 1234567890n;
    const answeredInRound = 4n;
    const [r, a, s, u, ar ] =   await tfiFeedRegistry.latestRoundData(
      registryKey, ethers.ZeroAddress
    );
    expect(r).to.equal(roundId);
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
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
    const roundId = 4n;
    const answer = 12345n;
    const startedAt = 1234567890n;
    const updatedAt = 1234567890n;
    const answeredInRound = 4n;
    const [r,  a, s, u, ar ] =   await tfiFeedAdapter.latestRoundData();

    // check return values
    expect(r).to.equal(roundId);
    expect(a).to.equal(answer);
    expect(s).to.equal(startedAt);
    expect(ar).to.equal(answeredInRound);
    });

});

