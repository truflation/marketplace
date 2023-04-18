"""
Set roles in smart contract
"""

import os
import sys
from web3 import Web3
from dotenv import load_dotenv
load_dotenv()

caller = os.environ['CALLER']
node_url = os.environ['NODE_URL']
private_key = os.environ['PRIVATE_KEY']
registry_address = os.environ['FEED_REGISTRY_ADDRESS']
user_address = sys.argv[1]
# Set up Web3 connection to Ethereum network
web3 = Web3(Web3.HTTPProvider(node_url))

# Set up contract addresses and ABIs

registry_abi = [
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role_",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "key_",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "address_",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "value",
          "type": "bool"
        }
      ],
      "name": "setAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]

contract = web3.eth.contract(address=registry_address, abi=registry_abi)
Chain_id = web3.eth.chain_id
nonce = web3.eth.get_transaction_count(caller)
web3.strict_bytes_type_checking = False
call_function = contract.functions.setAccess(
    b'get',
    b'truflation.cpi.us',
    user_address,
    True
).build_transaction({
    "chainId": Chain_id,
    "gasPrice": web3.eth.gas_price,
    "from": caller, "nonce": nonce
})
signed_tx = web3.eth.account.sign_transaction(
    call_function, private_key=private_key
)
send_tx = web3.eth.send_raw_transaction(
    signed_tx.rawTransaction
)
tx_receipt = web3.eth.wait_for_transaction_receipt(send_tx)
print(f'Transaction sent: {tx_receipt.transactionHash.hex()}')
