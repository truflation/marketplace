const { expect } = require("chai");

describe("Token contract", function () {
  it("Deploy", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TruflationToken");
    const token = await Token.deploy();
    await token.deployed()

    const TfiOperator = await ethers.getContractFactory("TfiOperator");
    const tfiOperator =
      await upgrades.deployProxy(TfiOperator, [
	token.address,
	owner.address
      ], { unsafeAllow: ['delegatecall'] });

    await tfiOperator.deployed();

  });
});
