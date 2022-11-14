// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionPayment.sol";
import "./interfaces/ISubscriptionManagerV4.sol";
import "./interfaces/ISubscriptionTicketManager.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";


contract SubscriptionManagerV4 is Initializable, OwnableUpgradeable, UUPSUpgradeable, ISubscriptionManagerV4 {

    ISubscriptionTicketManager public subscriptionTicketManager;
    mapping(uint256=>bool) public _blacklist;

    event ValidateSubscriptionStatus(
        uint256 indexed tokenId,
        address client,
        uint256 productId,
        uint256 result
    );


    function initialize(address _subscriptionTicketManager) initializer public {
        __Ownable_init();
        subscriptionTicketManager  = ISubscriptionTicketManager(_subscriptionTicketManager);
    }

    function setSubscriptionTicketManager(address _subscriptionTicketManager) public onlyOwner {
        subscriptionTicketManager  = ISubscriptionTicketManager(_subscriptionTicketManager);
    }


    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function subscriptionStatus(address sender, string calldata dataString1, string calldata dataString2,
        uint256 dataInt, address dataAddress, bytes calldata dataBytes) external view returns (uint256 errorCode){

        //Assume dataInt = productId, sender=clientAddress, dataString1 = tokenId
        uint256 tokenId;//TODO have to set tokenId

        errorCode = validateSubscriptionStatus(sender, tokenId, dataInt);
        //emit ValidateSubscriptionStatus(tokenId, client, productId, errorCode);
    }

    function validateSubscriptionStatus(address client, uint256 tokenId, uint256 productId) public view returns (uint256 errorCode){
        if(_blacklist[tokenId]){
            return 5; //this tokenId holder is in blacklist
        }
        try subscriptionTicketManager.ownerOf(tokenId) {
        } catch{
            return 4;//tokenID itself is invalid
        }
        if (subscriptionTicketManager.getClientAddress(tokenId) != client) {
            return 1;//Invalid client address for given tokenId
        }
        ISubscriptionTicketManager.Subscription memory subscriptionInfo = subscriptionTicketManager.getSubscriptionInfo(tokenId);
        if (subscriptionInfo.productId != productId) {
            return 2; //Invalid productId for given tokenId
        }
        if (subscriptionInfo.startTime <= block.timestamp && subscriptionInfo.endTime >= block.timestamp) {
            return 0;
        } else {
            return 3; //Invalid subscription period for given tokenId
        }
    }


    //Use only emergency case to terminate user access
    function terminateSubscriptionInForce(uint256 tokenId) external onlyOwner {
         _blacklist[tokenId] = true;
    }


    function getVersion() external virtual pure returns (uint256) {
        return 4;
    }


    /* ========== MODIFIERS ========== */


}
