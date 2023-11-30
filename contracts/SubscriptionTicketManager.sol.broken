// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./interfaces/ITicketURIDescriptor.sol";

//TODO upgrade openzeppelin version from 4.7.3 to 4.8.0. Some code modification is needed for that.
contract SubscriptionTicketManager is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    // details about the subscription ticket
    struct Subscription {
        // the subscribed product
        uint256 productId;
        // subscription period
        uint256 startTime;
        uint256 endTime;
    }

    mapping(uint256 => Subscription) public subscriptions;
    mapping(uint256 => address) public clientAddresses;
    mapping(address => bool) private _minter;
    ITicketURIDescriptor URIdescriptor;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC721_init("Truflation Subscription Tickets", "TST");
        __ERC721Enumerable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }


    function safeMint(address to, uint256 productId, uint256 start, uint256 end) external onlyMinter returns (uint256 tokenId) {
        tokenId = safeMint2(to, productId, start, end, to);
    }

    //Just one more parameter. change function name for sake of easy access from client script.
    function safeMint2(address to, uint256 productId, uint256 start, uint256 end, address client) public onlyMinter returns (uint256 tokenId) {
        tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        subscriptions[tokenId] = Subscription({
        productId: productId,
        startTime: start,
        endTime: end
        });
        clientAddresses[tokenId] = client;
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

    function setURIDescriptor(address _URIdescriptor) public onlyOwner {
        URIdescriptor = ITicketURIDescriptor(_URIdescriptor);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        //require(ownerOf(tokenId) != address(0), "tokenId does not exist");
        _requireMinted(tokenId);
        if(address(URIdescriptor) == address(0)){
            return "";
        }

        return URIdescriptor.generateTokenURI(tokenId, subscriptions[tokenId].productId, subscriptions[tokenId].startTime, subscriptions[tokenId].endTime);

//        string memory baseURI = _baseURI();
//        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    function _authorizeUpgrade(address newImplementation)
    internal
    onlyOwner
    override
    {}

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getVersion() external virtual pure returns (uint256) {
        return 1;
    }

    /* ========== MODIFIERS ========== */

    modifier onlyHolder(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "caller is not the owner of given token");
        _;
    }

    modifier onlyMinter() {
        require(_minter[msg.sender] == true || owner() == msg.sender, "caller is not authorized to mint");
        _;
    }
}
