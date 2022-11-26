// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {moveTime} = require("./utils/move-time");
const {moveBlocks} = require("./utils/move-blocks");
const {upgrades, ethers} = require("hardhat");

let subscriptionTicketManager, ticketURIDescriptor, subscriptionManager, packagePlanPayment, autoRenewPayment, deployer, subscriber1, subscriber2;

const SECONDS_IN_A_HOUR = 3600
const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_WEEK = 604800
const SECONDS_IN_A_YEAR = 31449600

const tokenAddress = "0x3417dd955d4408638870723B9Ad8Aae81953B478";
const productA = 10000;
const productB = 20000;

async function main() {

    await initialSetup();


    console.log('Complete');

}

async function initialSetup(){
    [deployer, subscriber1, subscriber2] = await ethers.getSigners();

    const subscriptionTicketManagerContract = await ethers.getContractFactory("SubscriptionTicketManager");

    //subscriptionTicketManager = await subscriptionTicketManagerContract.deploy();
    subscriptionTicketManager = await upgrades.deployProxy(subscriptionTicketManagerContract, [], { initializer: 'initialize', kind: 'uups' });

    await subscriptionTicketManager.deployed();
    console.log("SubscriptionTicketManager deployed to:", subscriptionTicketManager.address);

    const ticketURIDescriptorContract = await ethers.getContractFactory("TicketURIDescriptor");
    ticketURIDescriptor = await ticketURIDescriptorContract.deploy();
    await ticketURIDescriptor.deployed();
    console.log("TicketURIDescriptor deployed to:", ticketURIDescriptor.address);
    await subscriptionTicketManager.setURIDescriptor(ticketURIDescriptor.address);


    const subscriptionManagerContract = await ethers.getContractFactory("SubscriptionManager");

    subscriptionManager = await upgrades.deployProxy(subscriptionManagerContract, [subscriptionTicketManager.address], { initializer: 'initialize', kind: 'uups' });
    await subscriptionManager.deployed();
    console.log("SubscriptionManager deployed to:", subscriptionManager.address);

    //await subscriptionManager.setSubscriptionTicketManager(subscriptionTicketManager.address);

    const packagePlanPaymentContract = await ethers.getContractFactory("PackagePlanPayment");
    packagePlanPayment = await packagePlanPaymentContract.deploy(subscriptionTicketManager.address, tokenAddress);
    await packagePlanPayment.deployed();
    console.log("PackagePlanPayment deployed to:", packagePlanPayment.address);
    let packageIds = [1, 2, 3, 4];
    let packageFeesPlanA = [ethers.utils.parseEther("50"), ethers.utils.parseEther("300"), ethers.utils.parseEther("1000"), ethers.utils.parseEther("10000")];
    let packageFeesPlanB = [ethers.utils.parseEther("40"), ethers.utils.parseEther("240"), ethers.utils.parseEther("800"), ethers.utils.parseEther("8000")];
    await packagePlanPayment.updateFee(productA, packageIds, packageFeesPlanA);
    await packagePlanPayment.updateFee(productB, packageIds, packageFeesPlanB);

    await subscriptionTicketManager.addMinter(packagePlanPayment.address);

    const autoRenewPaymentContract = await ethers.getContractFactory("AutoRenewPayment");
    autoRenewPayment = await autoRenewPaymentContract.deploy(subscriptionTicketManager.address, tokenAddress, packagePlanPayment.address);
    await autoRenewPayment.deployed();
    console.log("AutoRenewPayment deployed to:", autoRenewPayment.address);

    await subscriptionTicketManager.addMinter(autoRenewPayment.address);


}





async function printBalance(signer){
    let balance = await usdToken.balanceOf(signer);
    return hre.ethers.utils.formatEther(balance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
