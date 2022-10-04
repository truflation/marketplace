// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {moveTime} = require("./utils/move-time");
const {moveBlocks} = require("./utils/move-blocks");
const {upgrades} = require("hardhat");

let subscriptionManager, usdToken, subscriptionPayment, packagePlanPayment, deployer, subscriber1, subscriber2, fee;

const SECONDS_IN_A_HOUR = 3600
const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_WEEK = 604800
const SECONDS_IN_A_YEAR = 31449600

const tokenAddress = "0x3417dd955d4408638870723B9Ad8Aae81953B478";
const productA = 10000;

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

    const subscriptionPaymentContract = await hre.ethers.getContractFactory("SubscriptionPayment");
    subscriptionPayment = await subscriptionPaymentContract.deploy(subscriptionManager.address, tokenAddress, productA, fee);
    await subscriptionPayment.deployed();
    console.log("SubscriptionPayment deployed to:", subscriptionPayment.address);

    await subscriptionManager.addPaymentChannel(productA, subscriptionPayment.address);

    const packagePlanPaymentContract = await hre.ethers.getContractFactory("PackagePlanPayment");
    packagePlanPayment = await packagePlanPaymentContract.deploy(subscriptionManager.address, tokenAddress, productA);
    await packagePlanPayment.deployed();
    console.log("PackagePlanPayment deployed to:", packagePlanPayment.address);

    await subscriptionManager.addPaymentChannel(productA, packagePlanPayment.address);


    //move reward token to staking contract
    //await usdToken.transfer(iBond.address, hre.ethers.utils.parseEther("1000000"));
    //move stake token to stakers
    // await usdToken.transfer(subscriber1.address, hre.ethers.utils.parseEther("10000"));
    // await usdToken.transfer(subscriber2.address, hre.ethers.utils.parseEther("10000"));
    //
    // await usdToken.connect(subscriber1).approve(subscriptionPayment.address, hre.ethers.constants.MaxUint256);
    // await usdToken.connect(subscriber2).approve(subscriptionPayment.address, hre.ethers.constants.MaxUint256);

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
