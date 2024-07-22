#!/usr/bin/env python3

"""
set data
"""

import os
import json
import datetime
import requests
from web3 import Web3
from dotenv import load_dotenv
load_dotenv()

print(f"getting {os.environ['REQUEST_URL']}")
response = requests.get(os.environ['REQUEST_URL']).text

obj = json.loads(response)

caller =  os.environ.get('ETH_CALLER', os.environ.get('CALLER'))
private_key = os.environ.get('ETH_PRIVATE_KEY', os.environ.get('PRIVATE_KEY'))
address = os.environ['FEED_REGISTRY_ADDRESS']
node_url = os.environ['NODE_URL']
name = bytes(os.environ['KEY_NAME'], "utf-8")

v = int(obj[os.environ['REQUEST_JSON']]* 10**18)
s = obj[os.environ['REQUEST_DATE']]
print(f'got result {v} {s}')
#v = 0
#s = '2023-01-01'
dts = int(datetime.datetime.strptime(s, '%Y-%m-%d').timestamp())
nts = int(datetime.datetime.utcnow().timestamp())
roundId = dts

web3 = Web3(Web3.HTTPProvider(node_url))
abi = [
        {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "key",
          "type": "bytes32"
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
        }
      ],
      "name": "setRoundData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]

print('setting')
contract = web3.eth.contract(
    address=address, abi=abi
)
Chain_id = web3.eth.chain_id
nonce = web3.eth.get_transaction_count(caller)
web3.strict_bytes_type_checking = False
call_function = contract.functions.setRoundData(
    name,
    v,
    dts
).build_transaction({"chainId": Chain_id,
                     "gasPrice": web3.eth.gas_price,
                     "from": caller, "nonce": nonce})
signed_tx = web3.eth.account.sign_transaction(
    call_function, private_key=private_key
)
send_tx = web3.eth.send_raw_transaction(
    signed_tx.rawTransaction
)
tx_receipt = web3.eth.wait_for_transaction_receipt(send_tx)
print(f'setting complete txid={tx_receipt.transactionHash.hex()}')
