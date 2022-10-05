// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionPayment.sol";
import "./interfaces/ISubscriptionManager.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";

//TODO add more events
//TODO implement subscription terminate-force method with ownerOnly
contract SubscriptionManager is Initializable, OwnableUpgradeable, UUPSUpgradeable, ISubscriptionManager {


    struct SubscriptionProduct {
        mapping(address=>uint256) clientAddrList;//client address => expiry date
        mapping(address=>address) addressOfSubscriber;//subscriber => client address
    }

    mapping(uint256=>SubscriptionProduct) productList;//productId => SubscriptionProduct
    mapping(address=>bool) public paymentChannels;



    function initialize() initializer public {
        __Ownable_init();
    }

    function setSubscriptionProduct(uint256 productId) public onlyOwner {
        SubscriptionProduct storage product = productList[productId];
    }

    function addPaymentChannel(address channel) public onlyOwner {
        paymentChannels[channel]=true;
    }

    function removePaymentChannel(address channel) public onlyOwner {
        paymentChannels[channel]=false;
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function subscriptionStatus(address sender, string calldata dataString1, string calldata dataString2,
        uint256 dataInt, address dataAddress, bytes calldata dataBytes) external view returns (uint256 errorCode){

        //Assume dataInt = productId, sender=clientAddress
        if (productList[dataInt].clientAddrList[sender] >= block.timestamp){
            return 0;
        } else {
            return 1;//temporal error code
        }
    }

    function isSubscriber(uint256 productId, address subscriber) public view returns (bool accessible) {
        address clientAddress = productList[productId].addressOfSubscriber[subscriber];
        return productList[productId].clientAddrList[clientAddress] >= block.timestamp;
    }

    function getSubscriptionExpiryDate(uint256 productId, address subscriber) external view returns (uint256 timestamp) {
        return productList[productId].clientAddrList[productList[productId].addressOfSubscriber[subscriber]];
    }

    //add client address for non-crypto payment user
    function addClientAddressByOwner(uint256 productId, address subscriber, address clientAddr, uint256 expiredDate) external onlyOwner {
        productList[productId].addressOfSubscriber[subscriber] = clientAddr;
        productList[productId].clientAddrList[clientAddr] = expiredDate;
    }

    function addSubscriptionPeriod(uint256 productId, address payer, uint256 extendPeriod) external paymentChannelOnly {
        if(isSubscriber(productId, payer)){ //current subscriber
            productList[productId].clientAddrList[productList[productId].addressOfSubscriber[payer]] += extendPeriod;
        } else { //
            if (productList[productId].addressOfSubscriber[payer]==address(0)){
                productList[productId].addressOfSubscriber[payer]= payer;
            }
            productList[productId].clientAddrList[productList[productId].addressOfSubscriber[payer]] = block.timestamp + extendPeriod;
        }
    }

    //Use only emergency case to terminate user access
    function terminateSubscriptionInForce(uint256 productId, address subscriber) external onlyOwner {
        productList[productId].clientAddrList[productList[productId].addressOfSubscriber[subscriber]] = 0;
    }

    function getClientAddressOfSubscriber(uint256 productId, address subscriber) external view returns (address clientAddress){
        return productList[productId].addressOfSubscriber[subscriber];
    }

    function updateClientAddressBySubscriber(uint256 productId, address clientAddr) external {
        require(isSubscriber(productId, msg.sender), "this is not the request from current subscriber");

        productList[productId].clientAddrList[clientAddr]=productList[productId].clientAddrList[productList[productId].addressOfSubscriber[msg.sender]];
        productList[productId].clientAddrList[productList[productId].addressOfSubscriber[msg.sender]] = 0;
        productList[productId].addressOfSubscriber[msg.sender]= clientAddr;
    }

    function getVersion() external virtual pure returns (uint256) {
        return 3;
    }


    /* ========== MODIFIERS ========== */
    modifier paymentChannelOnly() {
        require(paymentChannels[msg.sender] || owner() == msg.sender, "caller is not the payment channel contract");
        _;
    }

}
