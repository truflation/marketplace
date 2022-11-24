pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

// interface for subscription information
// this is intended to be a general interface to query a contract
// with arbitrary data
//
// the interface will return 0 if successful, otherwise it will
// return a user defined error code
//
// the function is declared view is looking at the status of the
// subscription should not change anything within the contract

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface ISubscriptionTicketManager is IERC721, IERC721Enumerable{

   struct Subscription {
      // the subscribed product
      uint256 productId;
      // subscription period
      uint256 startTime;
      uint256 endTime;
   }

   function safeMint(address to, uint256 productId, uint256 start, uint256 end) external returns (uint256 tokenId);
   function safeMint2(address to, uint256 productId, uint256 start, uint256 end, address client) external returns (uint256 tokenId);
   function getSubscriptionInfo(uint256 tokenId) external view returns (Subscription memory subscription);
   function getClientAddress(uint256 tokenId) external view returns (address client);
   function updateClientAddress(uint256 tokenId, address clientAddr) external;


}




