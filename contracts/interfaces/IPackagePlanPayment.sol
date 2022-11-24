pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT


interface IPackagePlanPayment {


   function getProductFee(uint256 productId, uint8 packageId) external view returns (uint256 fee);

   function purchasePackage(uint256 productId, uint8 packageId, uint8 duration) external;
}




