// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITruflationFeedRegistry {
  function latestRoundData(bytes32 dataType, address sender)
  external
  view
  returns (
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  );

  function getRoundData(
    bytes32 dataType, uint80 roundId_, address sender
  )
  external
  view
  returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
  );
}

