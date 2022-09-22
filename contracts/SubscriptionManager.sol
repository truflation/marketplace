// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionPayment.sol";
import "./interfaces/ISubscriptionManager.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";

contract SubscriptionManager is Initializable, OwnableUpgradeable, UUPSUpgradeable, ISubscriptionManager {
    //TODO need to consider if we should inherit ISubscriptionManager as upgradable contract.

    mapping(address=>uint256) clientAddrList;//client address => expiry date
    mapping(address=>address) addressOfSubscriber;
    //Right now one subscriber can only have one client addresses for access

    ISubscriptionPayment public subscriptionPayment;
    uint256 SECONDS_IN_A_DAY;


    function initialize() initializer public {
        SECONDS_IN_A_DAY = 86400;
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function setSubscriptionPayment(address _subscriptionPayment) public onlyOwner {
        subscriptionPayment = ISubscriptionPayment(_subscriptionPayment);
    }

    function subscriptionStatus(address sender, string calldata dataString1, string calldata dataString2,
        uint256 dataInt, address dataAddress, bytes calldata dataBytes) external view returns (uint256 errorCode){
        if (isAccessible(sender)){
            return 0;
        } else {
            return 1;//temporal error code
        }
    }

    function isAccessible(address user) public view returns (bool accessible) {
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
        require(subscriptionPayment.getSubscriptionExpiryDate(msg.sender) > block.timestamp,
            "this is not the request from current subscriber");

        if (addressOfSubscriber[msg.sender]!=address(0)){//Update client address
            clientAddrList[clientAddr]=clientAddrList[addressOfSubscriber[msg.sender]];
            clientAddrList[addressOfSubscriber[msg.sender]] = 0;
            addressOfSubscriber[msg.sender]= clientAddr;
        } else {//First time to set client address
            addressOfSubscriber[msg.sender]= clientAddr;
            clientAddrList[clientAddr] = subscriptionPayment.getSubscriptionExpiryDate(msg.sender)+SECONDS_IN_A_DAY;
        }
    }

    function getVersion() external virtual pure returns (uint256) {
        return 1;
    }


    /* ========== MODIFIERS ========== */
    modifier subscriptionPaymentOnly() {
        require(address(subscriptionPayment) ==msg.sender, "caller is not the subsciptionPayment contract");
        _;
    }

}
