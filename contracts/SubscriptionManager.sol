// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionPayment.sol";
import "./interfaces/ISubscriptionManager.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";

//TODO add more events
contract SubscriptionManager is Initializable, OwnableUpgradeable, UUPSUpgradeable, ISubscriptionManager {


    struct SubscriptionProduct {
        mapping(address=>uint256) clientAddrList;//client address => expiry date
        mapping(address=>address) addressOfSubscriber;
    }

    mapping(uint256=>SubscriptionProduct) productList;
    mapping(uint256=>mapping(address=>bool)) paymentChannels;
    //mapping(uint256=>address[]) public paymentChannels;



    function initialize() initializer public {
        __Ownable_init();
    }

    function setSubscriptionProduct(uint256 productId) public onlyOwner {
        SubscriptionProduct storage product = productList[productId];
    }

    function addPaymentChannel(uint256 productId, address channel) public onlyOwner {
        paymentChannels[productId][channel]=true;
    }

    function removePaymentChannel(uint256 productId, address channel) public onlyOwner {
        paymentChannels[productId][channel]=false;
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function subscriptionStatus(address sender, string calldata dataString1, string calldata dataString2,
        uint256 dataInt, address dataAddress, bytes calldata dataBytes) external view returns (uint256 errorCode){
        if (isAccessible(dataInt, sender)){
            return 0;
        } else {
            return 1;//temporal error code
        }
    }

    function isAccessible(uint256 productId, address user) public view returns (bool accessible) {
        return productList[productId].clientAddrList[user] >= block.timestamp;
    }

    //add client address for non-crypto payment user
    function addClientAddressByOwner(uint256 productId, address clientAddr, uint256 expiredDate) external onlyOwner {
        productList[productId].clientAddrList[clientAddr] = expiredDate;
    }

    function addNewSubscriber(uint256 productId, address payer, address clientAddr, uint256 expiredDate) external paymentChannelOnly(productId) {
        productList[productId].addressOfSubscriber[payer]= clientAddr;
        productList[productId].clientAddrList[clientAddr] = expiredDate;
    }

    function extendSubscriptionPeriod(uint256 productId, address payer, uint256 expiredDate) external paymentChannelOnly(productId) {
        productList[productId].clientAddrList[productList[productId].addressOfSubscriber[payer]] = expiredDate;
    }


    function updateClientAddressBySubscriber(uint256 productId, address clientAddr) external {
        require(productList[productId].clientAddrList[productList[productId].addressOfSubscriber[msg.sender]] > block.timestamp,
            "this is not the request from current subscriber");

        if (productList[productId].addressOfSubscriber[msg.sender]!=address(0)){//Update client address
            productList[productId].clientAddrList[clientAddr]=productList[productId].clientAddrList[productList[productId].addressOfSubscriber[msg.sender]];
            productList[productId].clientAddrList[productList[productId].addressOfSubscriber[msg.sender]] = 0;
            productList[productId].addressOfSubscriber[msg.sender]= clientAddr;
        }
    }

    function getVersion() external virtual pure returns (uint256) {
        return 2;
    }


    /* ========== MODIFIERS ========== */
    modifier paymentChannelOnly(uint256 productId) {
        require(paymentChannels[productId][msg.sender] || owner() == msg.sender, "caller is not the payment channel contract");
        _;
    }

}
