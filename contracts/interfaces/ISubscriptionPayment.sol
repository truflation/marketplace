// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISubscriptionPayment {
  // Views

  function getSubscriptionExpiryDate(address subscriber) external view returns (uint256 timestamp);



}
