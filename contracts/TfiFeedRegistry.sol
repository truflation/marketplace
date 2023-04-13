// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

bytes32 constant SET = "set";
bytes32 constant GET = "get";
bytes32 constant PROXY = "proxy";

contract TfiFeedRegistry is Initializable, OwnableUpgradeable,
AccessControlUpgradeable {
  struct RoundData {
    int256 answer;
    uint256 startedAt;
    uint256 updatedAt;
  }
  uint80 public latestRound;
  mapping (bytes32 => bool) private global;
  mapping (bytes32 => mapping(uint80 => RoundData)) private data;

  function initialize(
  ) public initializer {
    __Ownable_init();
    __AccessControl_init();
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
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
      global[key] || hasRole(roleId(GET, key), msg.sender) ||
      (
	hasRole(roleId(PROXY, key), msg.sender) &&
      	hasRole(roleId(GET, key), sender)
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
    require(hasRole(roleId(SET, key), msg.sender), "no permission");
    latestRound = roundId;
    data[key][roundId] = RoundData(answer, startedAt, updatedAt);
  }

  function roleId(
    bytes32 role,
    bytes32 key
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(role, key));
  }

  function setGlobal(
    bytes32 key_,
    bool value_
  ) public {
    global[key_] = value_;
  }

  function grantRoleForKey(
    bytes32 role_,
    bytes32 key_,
    address address_
  ) external {
    grantRole(roleId(role_, key_), address_);
  }

  function revokeRoleForKey(
    bytes32 role_,
    bytes32 key_,
    address address_
  ) external {
    revokeRole(roleId(role_, key_), address_);
  }
    
}
