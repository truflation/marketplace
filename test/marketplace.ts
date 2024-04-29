const { expect } = require("chai");

describe("Token contract", function () {
  it("Deploy", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("TruflationToken");
    const token = await Token.deploy();
    await token.waitForDeployment()

    const TfiOperator = await ethers.getContractFactory("TfiOperator");
    const tfiOperator =
      await upgrades.deployProxy(TfiOperator, [
	await token.getAddress(),
	await owner.getAddress()
      ], { unsafeAllow: ['delegatecall'] });

    await tfiOperator.waitForDeployment();

  });
});
