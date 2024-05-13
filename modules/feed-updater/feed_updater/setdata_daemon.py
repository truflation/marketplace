#!/usr/bin/env python3

"""

setdata_daemon.py

This daemon reads in pricing data and writes the data into
an ethereum compatible blockchain.

todo: convert to fastapi

Usage:
  setdata_daemon.py [--port=<n>]
"""

import os
from collections import deque

import ujson
from docopt import docopt
from web3 import AsyncWeb3
from dotenv import load_dotenv
from icecream import ic
from fastapi import FastAPI, Request, HTTPException
import uvicorn

load_dotenv()

app = FastAPI()
args = docopt(__doc__)
caller = os.environ.get('ETH_CALLER', os.environ.get('CALLER'))
private_key = os.environ.get('ETH_PRIVATE_KEY', os.environ.get('PRIVATE_KEY'))
address = os.environ['FEED_REGISTRY_ADDRESS']
node_url = os.environ['NODE_URL']
rounds_file = os.environ.get('ROUNDS_DATA', 'rounds.json')

web3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(node_url))
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

contract = web3.eth.contract(
    address=address, abi=abi
)

queue = deque()

@app.post('/send-data-multi')
async def handle_send_data_multi(request: Request):
    """
Handle send data
"""
    chain_id = await web3.eth.chain_id

    try:
        obj = await request.json()
        if not isinstance(obj, dict):
            raise HTTPException(
                status_code=400,
                detail='Invalid JSON format'
            )
        ic(f'Received data: {obj}')
        for name, values in obj.items():
            queue.append({
                'n': name,
                'r': rounds_data.read(name),
                'v': values['v'],
                's': values['s'],
                'u': values['u']
            })
            rounds_data.increment(name)

        web3.strict_bytes_type_checking = False
        nonce = await web3.eth.get_transaction_count(caller)
        retval = {}
        gas_price = await web3.eth.gas_price
        for obj in queue.copy():
            call_function = contract.functions.setRoundData(
                bytes(obj['n'], 'utf-8'),
                obj['r'],
                obj['v'],
                obj['s'],
                obj['u']
            ).build_transaction({
                "chainId": chain_id,
                "gasPrice": gas_price,
                "from": caller,
                "nonce": nonce
            })
            ic(nonce)
            signed_tx = web3.eth.account.sign_transaction(
                await call_function, private_key=private_key
            )
            ic('tx signed')
            send_tx = await web3.eth.send_raw_transaction(
                signed_tx.rawTransaction
            )
            ic(send_tx)
            retval[nonce] = send_tx.hex()
            nonce = nonce + 1
            queue.popleft()
        rounds_data.save()
        outputs = retval
        ic(outputs)
        return outputs
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail='Invalid JSON Format'
        ) from exc
    except Exception as exc:
        ic(exc)
        raise

if __name__ == '__main__':
    port_string = args.get('--port')
    uvicorn.run(
        app, host="0.0.0.0",
        port=8000 if port_string is None else int(port_string)
    )
