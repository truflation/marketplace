pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Authentication is Ownable {

    mapping(address=>uint256) clientAddrList;//client address => expiry date
    mapping(address=>address) addressOfSubscriber;//Right now one subscriber can only have one client addresses for access

    ISubscriptionPayment public subscriptionPayment;
    uint256 SECONDS_IN_A_DAY = 86400;


    constructor() {
    }

    function setSubscriptionPayment(address _subscriptionPayment) public onlyOwner {
        subscriptionPayment = ISubscriptionPayment(_subscriptionPayment);
    }



    function isAccessible(address user) external view returns (bool accessible) {
        return clientAddrList[user] >= block.timestamp;
    }

    //add client address for non-crypto payment user
    function addClientAddressByOwner(address clientAddr, uint256 expiredDate) external onlyOwner {
        clientAddrList[clientAddr] = expiredDate;
    }

    function addNewSubscriber(address payer, address clientAddr, uint256 expiredDate) external subscriptionPaymentOnly {
        addressOfSubscriber[payer]= clientAddr;
        clientAddrList[clientAddr] = expiredDate + SECONDS_IN_A_DAY;
    }

    function extendSubscriptionPeriod(address payer, uint256 expiredDate) external subscriptionPaymentOnly {
        clientAddrList[addressOfSubscriber[payer]] = expiredDate + SECONDS_IN_A_DAY;
    }


    function addClientAddressBySubscriber(address clientAddr) external {
        require(subscriptionPayment.getSubscriptionExpiryDate(msg.sender) > block.timestamp, "this is not the request from current subscriber");
        if (addressOfSubscriber[msg.sender]!=address(0)){//Update client address
            clientAddrList[addressOfSubscriber[msg.sender]] = 0;
            addressOfSubscriber[msg.sender]= clientAddr;
            clientAddrList[clientAddr]=subscriptionPayment.getSubscriptionExpiryDate(msg.sender)+SECONDS_IN_A_DAY;//Add 1 DAY buffer for access renewal period
        } else {//First time to set client address
            addressOfSubscriber[msg.sender]= clientAddr;
            clientAddrList[clientAddr] = subscriptionPayment.getSubscriptionExpiryDate(msg.sender)+SECONDS_IN_A_DAY;
        }
    }









    /* ========== MODIFIERS ========== */
    modifier subscriptionPaymentOnly() {
        require(address(subscriptionPayment) ==msg.sender, "caller is not the subsciptionPayment contract");
        _;
    }



}
