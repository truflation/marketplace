// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

bytes32 constant SET = "set";
bytes32 constant GET = "get";
bytes32 constant PROXY = "proxy";

contract TfiFeedRegistry is Initializable, OwnableUpgradeable {
  struct RoundData {
    int256 answer;
    uint256 startedAt;
    uint256 updatedAt;
  }
  uint80 public latestRound;
  mapping (bytes32 => mapping(uint80 => RoundData)) private data;
  mapping (bytes32 => mapping( bytes32 => mapping(address => bool)))
  private permissions;

  function initialize(
  ) public initializer {
    __Ownable_init();
  }

  function getRoundData(bytes32 key, uint80 roundId, address sender)
  public
  view
  virtual
  returns (
    uint80 roundId_,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  )
  {
    require(
      hasAccess(GET, key, address(0x0)) ||
        hasAccess(GET, key, msg.sender) ||
        (
	  hasAccess(PROXY, key, msg.sender) &&
      	    hasAccess(GET, key, sender)
        )
    );
    RoundData memory rd = data[key][roundId];
    return (roundId, rd.answer, rd.startedAt, rd.updatedAt, latestRound);
  }

  function latestRoundData(bytes32 key, address sender)
  external
  view
  virtual
  returns (
    uint80 roundId_,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  )
  {
    return getRoundData(key, latestRound, sender);
  }

  function setRoundData(
    bytes32 key,
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt
  )
  external
  virtual
  {
    require(hasAccess(SET, key, msg.sender), "no permission");
    latestRound = roundId;
    data[key][roundId] = RoundData(answer, startedAt, updatedAt);
  }

  function setAccess(
    bytes32 role_,
    bytes32 key_,
    address address_,
    bool value
  ) external onlyOwner {
    permissions[role_][key_][address_] = value;
  }

  function hasAccess(
    bytes32 role_,
    bytes32 key_,
    address address_
  ) private view returns (bool) {
    return permissions[role_][key_][address_];
  }    

}
