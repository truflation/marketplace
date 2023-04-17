#!/usr/bin/env python3

import os
import json
import datetime
from web3 import Web3
from dotenv import load_dotenv
load_dotenv()

caller = os.environ['CALLER']
private_key = os.environ['PRIVATE_KEY']
feed_adapter_address = os.environ['FEED_ADAPTER_ADDRESS']
node_url = os.environ['NODE_URL']
print(feed_adapter_address)
web3 = Web3(Web3.HTTPProvider(node_url))
with open('TfiFeedAdapter.json', encoding='utf-8') as f:
    abi = json.load(f)
    contract = web3.eth.contract(
        address=feed_adapter_address, abi=abi['abi'])
    Chain_id = web3.eth.chain_id
    result = contract.functions.latestRoundData().call()
    print(result)
