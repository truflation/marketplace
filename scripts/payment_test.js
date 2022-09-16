// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {moveTime} = require("./utils/move-time");
const {moveBlocks} = require("./utils/move-blocks");

let authorize, usdToken, subscriptionPayment, deployer, subscriber1, subscriber2, fee;

const SECONDS_IN_A_HOUR = 3600
const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_WEEK = 604800
const SECONDS_IN_A_YEAR = 31449600

async function main() {

    await initialSetup();
    console.log('Complete initial setup');

    //await rateOracle.dateTimestamp(2022, 9, 3);
    let accessible = await authorize.isAccessible(subscriber1.address);
    console.log('Can subscriber1 access to oracle? :', accessible);

    await subscriptionPayment.connect(subscriber1)["startSubscription()"]();
    await subscriptionPayment.connect(subscriber2)["startSubscription(address)"](subscriber2.address);

    accessible = await authorize.isAccessible(subscriber1.address);
    console.log('Can subscriber1 access to oracle? :', accessible);

    await moveTime(SECONDS_IN_A_DAY*32);
    await moveBlocks(1);

    accessible = await authorize.isAccessible(subscriber1.address);
    console.log('Can subscriber1 access to oracle? :', accessible);

    //await subscriptionPayment["collectServiceFee(address)"](subscriber1.address);
    await subscriptionPayment.collectServiceFee(subscriber1.address);
    accessible = await authorize.isAccessible(subscriber1.address);
    console.log('Can subscriber1 access to oracle? :', accessible);

    try{
        await subscriptionPayment.collectServiceFee(subscriber1.address);
    } catch (error){
        //this attempt should be failed as user has been already charged.
        console.log(error.message);
    }










    console.log('Complete');

}

async function initialSetup(){
    [deployer, subscriber1, subscriber2] = await hre.ethers.getSigners();
    fee = hre.ethers.utils.parseEther("1000");
    const usdTokenContract = await hre.ethers.getContractFactory("USDToken");
    usdToken = await usdTokenContract.deploy();
    await usdToken.deployed();
    console.log("usdToken deployed to:", usdToken.address);


    const authenticationContract = await hre.ethers.getContractFactory("Authentication");
    authorize = await authenticationContract.deploy();
    await authorize.deployed();
    console.log("Authentication deployed to:", authorize.address);

    const subscriptionPaymentContract = await hre.ethers.getContractFactory("SubscriptionPayment");
    subscriptionPayment = await subscriptionPaymentContract.deploy(authorize.address, usdToken.address, fee);
    await subscriptionPayment.deployed();
    console.log("SubscriptionPayment deployed to:", subscriptionPayment.address);

    await authorize.setSubscriptionPayment(subscriptionPayment.address);


    //move reward token to staking contract
    //await usdToken.transfer(iBond.address, hre.ethers.utils.parseEther("1000000"));
    //move stake token to stakers
    await usdToken.transfer(subscriber1.address, hre.ethers.utils.parseEther("10000"));
    await usdToken.transfer(subscriber2.address, hre.ethers.utils.parseEther("10000"));

    await usdToken.connect(subscriber1).approve(subscriptionPayment.address, hre.ethers.constants.MaxUint256);
    await usdToken.connect(subscriber2).approve(subscriptionPayment.address, hre.ethers.constants.MaxUint256);

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
