pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionManagerV2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
//import "@openzeppelin/contracts/utils/math/Math.sol";
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

    struct PackagePlan {
        uint256 period;
        uint256 fee;
    }
    mapping(uint8=>PackagePlan) public plans;

    mapping(address=>uint256) subscribedPeriod;

    ISubscriptionManagerV2 public subscriptionManager;
    IERC20 public currency;
    uint256 productId;

    address fundWallet;


    constructor(address _subscriptionManager, address _currency, uint256 _productId) {
        productId = _productId;
        subscriptionManager = ISubscriptionManagerV2(_subscriptionManager);
        currency = IERC20(_currency);
        //TODO make fee value configurable
        plans[DAILY] = PackagePlan(SECONDS_IN_A_DAY, 100 ether);
        plans[WEEKLY] = PackagePlan(SECONDS_IN_A_DAY, 500 ether);
        plans[MONTHLY] = PackagePlan(SECONDS_IN_A_DAY, 1200 ether);
        plans[YEARLY] = PackagePlan(SECONDS_IN_A_DAY, 10000 ether);
        fundWallet = msg.sender;
    }

    function updateFee(uint8 planId, uint256 _fee) public onlyOwner{
        plans[planId].fee = _fee;
    }



    function startSubscription(address client, uint8 planId, uint8 duration) public {
        uint price = plans[planId].fee * duration;
        console.log('price: %s', price);
        currency.safeTransferFrom(msg.sender, address(this), price);
        //TODO will transfer collected fund to other company wallet
        subscribedPeriod[msg.sender] = block.timestamp + plans[planId].period.mul(duration);
        subscriptionManager.addNewSubscriber(productId, msg.sender, client, subscribedPeriod[msg.sender]);
        IERC20(currency).safeTransfer(fundWallet, price);
    }




    function withdrawFee() public onlyOwner {
        currency.safeTransfer(msg.sender, currency.balanceOf(address(this)));
    }


    function getSubscriptionExpiryDate(address subscriber) external view returns (uint256 timestamp) {
        return subscribedPeriod[subscriber];
    }


    /* ========== MODIFIERS ========== */



}
