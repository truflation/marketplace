#!/usr/bin/env python3

"""

setdata_daemon.py

This daemon reads in pricing data and writes the data into
an ethereum compatible blockchain.

todo: convert to fastapi

"""

import os
import ujson
from web3 import Web3
from dotenv import load_dotenv
from icecream import ic
from sanic import Sanic
from sanic.response import json
load_dotenv()

app = Sanic('setdata_daemon')
caller = os.environ.get('ETH_CALLER', os.environ.get('CALLER'))
private_key = os.environ.get('ETH_PRIVATE_KEY', os.environ.get('PRIVATE_KEY'))
address = os.environ['FEED_REGISTRY_ADDRESS']
node_url = os.environ['NODE_URL']
rounds_file = os.environ.get('ROUNDS_DATA', 'rounds.json')

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
        }
      ],
      "name": "setRoundData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]

contract = web3.eth.contract(
    address=address, abi=abi
)
chain_id = web3.eth.chain_id

class RoundsData:
    def __init__(self, file_path):
        self.rounds = {}
        self.file_path = file_path
        try:
            self.load()
        except FileNotFoundError:
            pass
    def load(self):
        with open(self.file_path, 'r',
                  encoding='utf-8') as file:
            self.rounds = ujson.load(file)
    def save(self):
        with open(self.file_path, 'w',
                  encoding='utf-8') as file:
            ujson.dump(self.rounds, file)
    def read(self, value):
        return self.rounds.get(value, 0)
    def increment(self, value):
        self.rounds[value] = \
            self.read(value) + 1

rounds_data = RoundsData(rounds_file)
nonce = web3.eth.get_transaction_count(caller)
@app.route('/send-data-multi', methods=['POST'])
async def handle_send_data_multi(request):
    """
Handle send data
"""
    global nonce
    try:
        obj = request.json
        if not isinstance(obj, dict):
            return json({'error': 'Invalid JSON format'}, status=400)
        ic(f'Received data: {obj}')
        web3.strict_bytes_type_checking = False
        output = {}
        send_tx = {}
        call_function = {}
        for name, values in obj.items():
            call_function[name] = contract.functions.setRoundData(
                bytes(name, 'utf-8'),
                rounds_data.read(name),
                values['v'],
                values['s'],
                values['u']
            ).build_transaction({
                "chainId": chain_id,
                "gasPrice": web3.eth.gas_price,
                "from": caller,
                "nonce": nonce
            })
            nonce = nonce + 1
            ic(nonce)

        for name in obj:
            signed_tx = web3.eth.account.sign_transaction(
                call_function[name], private_key=private_key
            )
            ic(signed_tx)
            send_tx[name] = web3.eth.send_raw_transaction(
                signed_tx.rawTransaction
            )
            ic(send_tx)
            rounds_data.increment(name)
        rounds_data.save()
        outputs = {name: value.hex()
                   for name, value in send_tx.items()}
        ic(outputs)
        return json(
            outputs
        , status=200)
    except ValueError:
        return json({'error': 'Invalid JSON format'}, status=400)


@app.route('/send-data', methods=['POST'])
async def handle_send_data(request):
    """
Handle send data
"""
    try:
        obj = request.json
        if not isinstance(obj, dict):
            return json({'error': 'Invalid JSON format'}, status=400)
        ic(f'Received data: {obj}')
        print('setting')
        nonce = web3.eth.get_transaction_count(caller)
        web3.strict_bytes_type_checking = False
#        dts = int(datetime.datetime.strptime(s, '%Y-%m-%d').timestamp())
#        nts = int(datetime.datetime.utcnow().timestamp())
#        roundId = dts

        call_function = contract.functions.setRoundData(
            bytes(obj['n'], 'utf-8'),
            obj['r'],
            obj['v'],
            obj['s'],
            obj['u']
        ).build_transaction({
            "chainId": chain_id,
            "gasPrice": web3.eth.gas_price,
            "from": caller,
            "nonce": nonce
        })
        signed_tx = web3.eth.account.sign_transaction(
            call_function, private_key=private_key
        )
        send_tx = web3.eth.send_raw_transaction(
            signed_tx.rawTransaction
        )
        tx_receipt = web3.eth.wait_for_transaction_receipt(send_tx)
        ic(f'setting complete txid={tx_receipt.transactionHash.hex()}')
        return json({
            'txid':
            tx_receipt.transactionHash.hex()
        }, status=200)
    except ValueError:
        return json({'error': 'Invalid JSON format'}, status=400)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
