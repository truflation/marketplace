// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//TODO make it UUPS upgrabable contract
//TODO implement ERC721Permit for better usability
contract SubscriptionTicketManager is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // details about the subscription ticket
    struct Subscription {
        // the subscribed product
        uint256 productId;
        // subscription period
        uint256 startTime;
        uint256 endTime;
    }

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => Subscription) public subscriptions;
    mapping(uint256 => address) public clientAddresses;
    mapping(address => bool) private _minter;

    constructor() ERC721("Truflation Subscription Tickets", "TST") {}


    function safeMint(address to, uint256 productId, uint256 start, uint256 end) external onlyMinter returns (uint256 tokenId) {
        tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        subscriptions[tokenId] = Subscription({
            productId: productId,
            startTime: start,
            endTime: end
        });
        clientAddresses[tokenId] = to;
    }

    function getSubscriptionInfo(uint256 tokenId) external view returns (Subscription memory subscription) {
        subscription = subscriptions[tokenId];
    }

    function getClientAddress(uint256 tokenId) external view returns (address client) {
        client = clientAddresses[tokenId];
    }

    function updateClientAddress(uint256 tokenId, address clientAddr) external onlyHolder(tokenId) {
        clientAddresses[tokenId] = clientAddr;
    }

    function addMinter(address minter) public onlyOwner {
        _minter[minter] = true;
    }

    function removeMinter(address minter) public onlyOwner {
        _minter[minter] = false;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    modifier onlyHolder(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "caller is not the owner of given token");
        _;
    }

    modifier onlyMinter() {
        require(_minter[msg.sender] == true || owner() == msg.sender, "caller is not authorized to mint");
        _;
    }
}
