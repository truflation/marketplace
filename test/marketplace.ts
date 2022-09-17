const { expect } = require("chai");

describe("Token contract", function () {
  it("Deploy", async function () {
    const [owner] = await ethers.getSigners();
    const TfiToken = await ethers.getContractFactory("TfiToken");
    const tfiToken = await TfiToken.deploy();
    await tfiToken.deployed()

    const TfiOperator = await ethers.getContractFactory("TfiOperator");
    const tfiOperator =
      await upgrades.deployProxy(TfiOperator, [
	tfiToken.address,
	owner.address
      ], { unsafeAllow: ['delegatecall'] });

    await tfiOperator.deployed();

  });
});
