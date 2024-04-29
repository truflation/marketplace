import { ethers } from "hardhat";
const { expect } = require("chai");

describe("Token contract", function () {
  let subtest;
  before(async function() {
    const [owner] = await ethers.getSigners();
    const SubscriptionTest =
      await ethers.getContractFactory("SubscriptionTest")
    subtest = await SubscriptionTest.deploy()
    await subtest.waitForDeployment()
  })
  it("test", async function() {
    expect(await subtest.subscriptionStatus(
      "0x0000000000000000000000000000000000000000",
      "test",
      "test",
      42,
      "0x0000000000000000000000000000000000000000",
      ethers.ZeroHash), 42)
  })
});
