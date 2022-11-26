// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ITicketURIDescriptor  {

    function generateTokenURI(uint256 tokenId, uint256 productId, uint256 startTime, uint256 endTime) external view returns (string memory);


}
