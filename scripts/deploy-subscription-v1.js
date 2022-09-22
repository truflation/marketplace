// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require('hardhat');
const hre = require("hardhat");

async function main () {

  const currencyAddress = "0x3417dd955d4408638870723B9Ad8Aae81953B478";//Truflation Token
  const fee = hre.ethers.utils.parseEther("1200");


  const SubscriptionManagerContract = await ethers.getContractFactory('SubscriptionManager');
  console.log('Deploying SubscriptionManager...');
  const subscriptionManagerV1 = await upgrades.deployProxy(SubscriptionManagerContract, [], { initializer: 'initialize', kind: 'uups' });

  await subscriptionManagerV1.deployed();
  console.log('SubscriptionManagerV1 deployed to:', subscriptionManagerV1.address);
  console.log(await subscriptionManagerV1.getVersion());

  const SubscriptionPaymentContract = await hre.ethers.getContractFactory("SubscriptionPayment");
  const subscriptionPayment = await SubscriptionPaymentContract.deploy(subscriptionManagerV1.address, currencyAddress, fee);
  await subscriptionPayment.deployed();
  console.log("SubscriptionPayment deployed to:", subscriptionPayment.address);

  await subscriptionManagerV1.setSubscriptionPayment(subscriptionPayment.address);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
