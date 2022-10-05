// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {moveTime} = require("./utils/move-time");
const {moveBlocks} = require("./utils/move-blocks");
const {upgrades, ethers} = require("hardhat");

let subscriptionManager, usdToken, subscriptionPayment, packagePlanPayment, deployer, subscriber1, subscriber2, fee;

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
    [deployer, subscriber1, subscriber2] = await hre.ethers.getSigners();
    fee = hre.ethers.utils.parseEther("1000");


    //TODO change deployment way
    const subscriptionManagerContract = await hre.ethers.getContractFactory("SubscriptionManager");
    subscriptionManager = await upgrades.deployProxy(subscriptionManagerContract, [], { initializer: 'initialize', kind: 'uups' });
    await subscriptionManager.deployed();
    console.log("SubscriptionManager deployed to:", subscriptionManager.address);


    const packagePlanPaymentContract = await hre.ethers.getContractFactory("PackagePlanPayment");
    packagePlanPayment = await packagePlanPaymentContract.deploy(subscriptionManager.address, tokenAddress);
    await packagePlanPayment.deployed();
    console.log("PackagePlanPayment deployed to:", packagePlanPayment.address);

    let packageIds = [1, 2, 3, 4];
    let packageFeesPlanA = [ethers.utils.parseEther("50"), ethers.utils.parseEther("300"), ethers.utils.parseEther("1000"), ethers.utils.parseEther("10000")];
    let packageFeesPlanB = [ethers.utils.parseEther("40"), ethers.utils.parseEther("240"), ethers.utils.parseEther("800"), ethers.utils.parseEther("8000")];
    await packagePlanPayment.updateFee(productA, packageIds, packageFeesPlanA);
    await packagePlanPayment.updateFee(productB, packageIds, packageFeesPlanB);

    await subscriptionManager.addPaymentChannel(packagePlanPayment.address);

    const subscriptionPaymentContract = await hre.ethers.getContractFactory("SubscriptionPayment");
    subscriptionPayment = await subscriptionPaymentContract.deploy(subscriptionManager.address, tokenAddress);
    await subscriptionPayment.deployed();
    console.log("SubscriptionPayment deployed to:", subscriptionPayment.address);

    await subscriptionPayment.updateFee(productA, ethers.utils.parseEther("1000"));
    await subscriptionPayment.updateFee(productB, ethers.utils.parseEther("800"));

    await subscriptionManager.addPaymentChannel(subscriptionPayment.address);



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
