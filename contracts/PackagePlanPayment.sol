// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionManager.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract PackagePlanPayment is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    uint8 public DAILY = 1;
    uint8 public WEEKLY = 2;
    uint8 public MONTHLY = 3;
    uint8 public YEARLY = 4;

    uint256 SECONDS_IN_A_DAY = 86400;
    uint256 SECONDS_IN_A_WEEK = 604800;
    uint256 SECONDS_IN_A_MONTH = 2592000; //30day
    uint256 SECONDS_IN_A_YEAR = 31449600; //365days


    mapping(uint256=>mapping(uint8=>uint256)) productFees;//productId=>period=>fee
    mapping(uint8=>uint256) public packagePeriod;

    ISubscriptionManager public subscriptionManager;
    IERC20 public currency;

    address fundWallet;


    constructor(address _subscriptionManager, address _currency) {
        subscriptionManager = ISubscriptionManager(_subscriptionManager);
        currency = IERC20(_currency);
        packagePeriod[DAILY] = SECONDS_IN_A_DAY;
        packagePeriod[WEEKLY] = SECONDS_IN_A_WEEK;
        packagePeriod[MONTHLY] = SECONDS_IN_A_MONTH;
        packagePeriod[YEARLY] = SECONDS_IN_A_YEAR;
        fundWallet = msg.sender;
    }

    function updateFundWallet(address _fundWallet) public onlyOwner{
        fundWallet = _fundWallet;
    }


    function updateFee(uint256 productId, uint8[] memory packageId, uint256[] memory feeList) public onlyOwner{
        require(packageId.length == feeList.length, "given parameter is wrong");
        for(uint i=0; i<packageId.length; i++){
            productFees[productId][packageId[i]]= feeList[i];
        }
    }

    function getProductFee(uint256 productId, uint8 packageId) public view returns (uint256 fee) {
        return productFees[productId][packageId];
    }



    function purchasePackage(uint256 productId, uint8 packageId, uint8 duration) public {
        //TODO if auto-renew function is on, stop execution.
        subscriptionManager.getSubscriptionExpiryDate(productId, msg.sender);
        uint256 price = productFees[productId][packageId].mul(duration);
        currency.safeTransferFrom(msg.sender, address(this), price);
        subscriptionManager.addSubscriptionPeriod(productId, msg.sender, packagePeriod[packageId]);
        currency.safeTransfer(fundWallet, price);
    }

    //To rescue the fund in case token has been wrongly deposited into this contract
    function withdrawFee(address token) public onlyOwner {
        IERC20(token).safeTransfer(msg.sender, IERC20(token).balanceOf(address(this)));
    }




    /* ========== MODIFIERS ========== */



}
