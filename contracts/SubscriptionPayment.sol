// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionManager.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";


//TODO the name can be AutoRenewPayment and once collect fund, status will update to Subscription Manager through PackagePlan Payment
contract SubscriptionPayment is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    uint256 SECONDS_IN_A_DAY = 86400;
    uint256 SECONDS_IN_A_MONTH = 2592000; //30day

    //this field is needed to identify renewal users on next billing cycle
    mapping(uint256 =>mapping(address=>bool)) subscribers;//productId => subscriber => bool
    mapping(uint256 => mapping(address=>uint256)) subscribedPeriod; //productId => subscriber => expiry date
    mapping(uint256 => uint256) fees;//productId => fee for 30 Days

    ISubscriptionManager public subscriptionManager;
    IERC20 public currency;
    address fundWallet;


    constructor(address _subscriptionManager, address _currency) {
        subscriptionManager = ISubscriptionManager(_subscriptionManager);
        currency = IERC20(_currency);
        fundWallet = msg.sender;
    }

    function updateFee(uint256 productId, uint256 _fee) public onlyOwner{
        fees[productId] = _fee;
    }


    function startSubscription(uint256 productId) public {
        //Note: there is a risk if expiryDate is within next 24 hours.
        uint256 expiryDate = subscriptionManager.getSubscriptionExpiryDate(productId, msg.sender);
        if(!subscriptionManager.isSubscriber(productId, msg.sender)){
            currency.safeTransferFrom(msg.sender, address(this), fees[productId]);
            currency.transfer(fundWallet, fees[productId]);
            //add 1 Day for subscription buffer
            subscriptionManager.addSubscriptionPeriod(productId, msg.sender, SECONDS_IN_A_MONTH + SECONDS_IN_A_DAY);
            subscribedPeriod[productId][msg.sender] = block.timestamp + SECONDS_IN_A_MONTH;
        } else { //user is subscriber
            subscribedPeriod[productId][msg.sender] = expiryDate + SECONDS_IN_A_MONTH;
        }
        subscribers[productId][msg.sender] = true;

    }


    //stop billing from next cycle
    function terminateSubscription(uint256 productId) external{
        subscribers[productId][msg.sender] = false;
    }


    //TODO need to clarify how to know the subscriber list. fetching it from mapping is a bit cumbersome
    function collectServiceFeeFromAll(uint256[] memory _productId, address[] memory _subscribers) external{
        require(_productId.length == _subscribers.length, "given parameter is wrong");
        for (uint8 i=0; i<_subscribers.length; i++) {
            if(subscribers[_productId[i]][_subscribers[i]]){
                collectServiceFee(_productId[i], _subscribers[i]);
            }
        }
    }


    //executed by anyone. 30DAY subscription period
    function collectServiceFee(uint256 productId, address subscriber) public
    {
        require(subscribers[productId][subscriber], 'user is not subscriber');
        require(subscribedPeriod[productId][subscriber]<block.timestamp, 'user already paid');
        try currency.transferFrom(subscriber, address(this), fees[productId]){
            subscribedPeriod[productId][subscriber] += SECONDS_IN_A_DAY*30;
            //add 1 Day for subscription buffer
            subscriptionManager.addSubscriptionPeriod(productId, subscriber, SECONDS_IN_A_MONTH + SECONDS_IN_A_DAY);
            currency.transfer(fundWallet, fees[productId]);
        } catch {
            subscribers[productId][subscriber] = false;
            //nothing will update in Authentication contract(automatically expired)
        }
    }


    //To rescue the fund in case token has been wrongly deposited into this contract
    function withdrawFee(address token) public onlyOwner {
        IERC20(token).safeTransfer(msg.sender, IERC20(token).balanceOf(address(this)));
    }

    function updateFundWallet(address _fundWallet) public onlyOwner{
        fundWallet = _fundWallet;
    }

    function getAutoRenewDate(uint256 productId, address subscriber) external view returns (uint256 timestamp) {
        return subscribedPeriod[productId][subscriber];
    }

    function isAutoRenew(uint256 productId, address subscriber) external view returns (bool) {
        return subscribers[productId][subscriber];
    }


/* ========== MODIFIERS ========== */



}
