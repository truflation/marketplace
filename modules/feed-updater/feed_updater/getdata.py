#!/usr/bin/env python3

""" Module for getting data from arbitrum """

import os
from web3 import Web3
from dotenv import load_dotenv
load_dotenv()

feed_adapter_address = os.environ['FEED_ADAPTER_ADDRESS']
node_url = os.environ['NODE_URL']
caller = os.environ['CALLER']
web3 = Web3(Web3.HTTPProvider(node_url))

abi = [
    {
      "inputs": [
        {
          "internalType": "uint80",
          "name": "roundId",
          "type": "uint80"
        }
      ],
      "name": "getRoundData",
      "outputs": [
        {
          "internalType": "uint80",
          "name": "roundId_",
          "type": "uint80"
        },
        {
          "internalType": "int256",
          "name": "answer",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "startedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "updatedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint80",
          "name": "answeredInRound",
          "type": "uint80"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestRound",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestRoundData",
      "outputs": [
        {
          "internalType": "uint80",
          "name": "roundId",
          "type": "uint80"
        },
        {
          "internalType": "int256",
          "name": "answer",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "startedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "updatedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint80",
          "name": "answeredInRound",
          "type": "uint80"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
]

contract = web3.eth.contract(
    address=feed_adapter_address, abi=abi
)
result = contract.functions.latestRoundData().call({
    'from': caller
})
print(result)
