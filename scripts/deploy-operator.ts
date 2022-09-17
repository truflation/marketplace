import { ethers, upgrades } from "hardhat";

async function main() {
  const TfiOperator = await ethers.getContractFactory("TfiOperator");
  const tfiOperator =
    await upgrades.deployProxy(TfiOperator, [
      '0x3417dd955d4408638870723B9Ad8Aae81953B478',
      '0x968E88df55AcAeC002e3d7c2393F9742e40d94b9'
    ]);

  await tfiOperator.deployed();
  console.log(`operator deployed to ${tfiOperator.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
