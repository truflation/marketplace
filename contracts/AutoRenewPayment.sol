// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./interfaces/ISubscriptionTicketManager.sol";
import "./interfaces/IPackagePlanPayment.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";


contract AutoRenewPayment is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    uint256 SECONDS_IN_A_DAY = 86400;
    uint256 SECONDS_IN_A_MONTH = 2592000; //30day

    uint8 public DAILY = 1;
    uint8 public WEEKLY = 2;
    uint8 public MONTHLY = 3;
    uint8 public YEARLY = 4;

    ISubscriptionTicketManager public subscriptionTicketManager;
    IPackagePlanPayment public packagePlanPayment;
    IERC20 public currency;
    address fundWallet;

    EnumerableSet.UintSet private autoRenewTokens;

    event AutoRenewSuccess(
        uint256 indexed tokenId,
        uint256 productId,
        uint256 startTime,
        uint256 endTime,
        uint256 newTokenId
    );

    event AutoRenewFailure(
        uint256 indexed tokenId,
        address owner,
        uint256 productId
    );


    constructor(address _subscriptionTicketManager, address _currency, address _packagePlanPayment) {
        subscriptionTicketManager = ISubscriptionTicketManager(_subscriptionTicketManager);
        currency = IERC20(_currency);
        packagePlanPayment = IPackagePlanPayment(_packagePlanPayment);
        fundWallet = msg.sender;
    }



    function isAutoRenew(uint256 tokenId) external view returns (bool) {
        return autoRenewTokens.contains(tokenId);
    }

    function getAutoRenewTokenList() public view returns (uint256[] memory) {
        return autoRenewTokens.values();
    }


    function startAutoRenew(uint256 tokenId) public {
        require(subscriptionTicketManager.ownerOf(tokenId)==msg.sender, "the caller is not authorized user");
        autoRenewTokens.add(tokenId);
    }


    //stop billing from next cycle
    function terminateAutoRenew(uint256 tokenId) external{
        require(subscriptionTicketManager.ownerOf(tokenId)==msg.sender, "the caller is not authorized user");
        require(autoRenewTokens.contains(tokenId), "Given token ID is not auto-renewal mode");
        autoRenewTokens.remove(tokenId);
    }


    function collectServiceFeeFromAll() external nonReentrant {
        for (uint8 i=0; i<autoRenewTokens.length(); i++) {
            uint256 tokenId = autoRenewTokens.at(i);
            if (subscriptionTicketManager.getSubscriptionInfo(tokenId).endTime.sub(SECONDS_IN_A_DAY) < block.timestamp){
                collectServiceFee(tokenId);
            }
        }
    }

    //Note: this can be executed by anyone, but can be limited as onlyOwner if needed.
    //Note2: At the moment, only support monthly auto-renew. but this can be tailored.
    function collectServiceFee(uint256 tokenId) public nonReentrant {
        require(autoRenewTokens.contains(tokenId), "Given token ID is not auto-renewal mode");
        ISubscriptionTicketManager.Subscription memory subscriptionInfo = subscriptionTicketManager.getSubscriptionInfo(tokenId);
        require(subscriptionInfo.endTime.sub(SECONDS_IN_A_DAY) < block.timestamp, 'user already paid');
        uint256 fee = packagePlanPayment.getProductFee(subscriptionInfo.productId, MONTHLY);
        address subscriber = subscriptionTicketManager.ownerOf(tokenId);
        try currency.transferFrom(subscriber, address(this), fee){
            currency.transfer(fundWallet, fee);
            uint256 newTokenId = subscriptionTicketManager.safeMint2(subscriber, subscriptionInfo.productId,
                subscriptionInfo.endTime, subscriptionInfo.endTime.add(SECONDS_IN_A_MONTH), subscriptionTicketManager.getClientAddress(tokenId));
            //TODO perhaps some callback function should be thrown to client address, then user can update tokenId at their end.
            autoRenewTokens.add(newTokenId);
            autoRenewTokens.remove(tokenId);
            emit AutoRenewSuccess(tokenId, subscriptionInfo.productId, subscriptionInfo.endTime, subscriptionInfo.endTime.add(SECONDS_IN_A_MONTH), newTokenId);
        } catch { //failed to collect fee from subscriber's account. possibly due to balance shortage.
            autoRenewTokens.remove(tokenId);
            emit AutoRenewFailure(tokenId, subscriber, subscriptionInfo.productId);
        }
    }


    //To rescue the fund in case token has been wrongly deposited into this contract
    function withdrawFee(address token) public onlyOwner {
        IERC20(token).safeTransfer(msg.sender, IERC20(token).balanceOf(address(this)));
    }

    function updateFundWallet(address _fundWallet) public onlyOwner{
        fundWallet = _fundWallet;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }



/* ========== MODIFIERS ========== */



}
