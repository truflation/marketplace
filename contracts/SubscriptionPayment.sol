pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionManagerV2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
//import "@openzeppelin/contracts/utils/math/SafeMath.sol";
//import "@openzeppelin/contracts/utils/math/Math.sol";
import "hardhat/console.sol";

contract SubscriptionPayment is Ownable {
    using SafeERC20 for IERC20;

    uint256 SECONDS_IN_A_DAY = 86400;

    mapping(address=>bool) public subscribers;//this field is needed to identify renewal users on next billing cycle
    mapping(address=>uint256) subscribedPeriod;

    ISubscriptionManagerV2 public subscriptionManager;
    IERC20 public currency;
    uint256 public fee; //fee for 30DAY
    uint256 productId;


    constructor(address _subscriptionManager, address _currency, uint256 _productId, uint256 _fee) {
        subscriptionManager = ISubscriptionManagerV2(_subscriptionManager);
        currency = IERC20(_currency);
        productId = _productId;
        fee = _fee;
    }

    function updateFee(uint256 _fee) public onlyOwner{
        fee = _fee;
    }

    //can consider to change the function name to avoid polymorphism which cause some tips to access from client.
    function startSubscription() public {
       startSubscription(msg.sender);
    }

    function startSubscription(address client) public {
        currency.safeTransferFrom(msg.sender, address(this), fee);
        //TODO will transfer collected fund to other company wallet
        subscribers[msg.sender] = true;
        subscribedPeriod[msg.sender] = block.timestamp + SECONDS_IN_A_DAY*30;
        console.log(client);
        //add 1 Day for subscription buffer
        subscriptionManager.addNewSubscriber(productId, msg.sender, client, subscribedPeriod[msg.sender]+SECONDS_IN_A_DAY);
    }


    //stop billing from next cycle
    function terminateSubscription() external{
        subscribers[msg.sender] = false;
    }


    //TODO need to clarify how to know the subscriber list. fetching it from mapping is a bit cumbersome
    function collectServiceFeeFromAll(address[] memory _subscribers) external{

        for (uint8 i=0; i<_subscribers.length; i++) {
            if(subscribers[_subscribers[i]]){
                collectServiceFee(_subscribers[i]);
            }
        }
    }


    //executed by anyone. 30DAY subscription period
    function collectServiceFee(address subscriber) public
    {
        require(subscribers[subscriber], 'user is not subscriber');
        require(subscribedPeriod[subscriber]<block.timestamp, 'user already paid');
        try currency.transferFrom(subscriber, address(this), fee){
            subscribedPeriod[subscriber] += SECONDS_IN_A_DAY*30;
            //add 1 Day for subscription buffer
            subscriptionManager.extendSubscriptionPeriod(productId, subscriber, subscribedPeriod[subscriber]+SECONDS_IN_A_DAY);
            //TODO will transfer collected fund to other company wallet
        } catch {
            subscribers[subscriber] = false;
            //nothing will update in Authentication contract(automatically expired)
        }
    }


    function withdrawFee() public onlyOwner {
        currency.safeTransfer(msg.sender, currency.balanceOf(address(this)));
    }


    function getSubscriptionExpiryDate(address subscriber) external view returns (uint256 timestamp) {
        return subscribedPeriod[subscriber];
    }


    /* ========== MODIFIERS ========== */



}
