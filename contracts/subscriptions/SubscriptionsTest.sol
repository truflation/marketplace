pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

import "../interfaces/ISubscriptionManager.sol";

// echo subscrption code to subscription request
// this is used for testing

contract SubscriptionTest  {
   function subscriptionStatus(address,
      string calldata,
      string calldata,
      uint256 echoCode,
      address,
      bytes calldata) external pure returns
      (uint256 errorCode) {
      return echoCode;
  }
}

