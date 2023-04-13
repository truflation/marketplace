#!/usr/bin/env python3

import os
import json
import datetime
import requests
from web3 import Web3
from dotenv import load_dotenv
load_dotenv()

response = requests.get(os.environ['REQUEST_URL']).text
obj = json.loads(response)
caller = os.environ['CALLER']
private_key = os.environ['PRIVATE_KEY']

v = int(obj[os.environ['REQUEST_JSON']]* 10**18)
s = obj[os.environ['REQUEST_DATE']]
dts = int(datetime.datetime.strptime(s, '%Y-%m-%d').timestamp())
nts = int(datetime.datetime.utcnow().timestamp())
roundId = dts

node_url = 'CHAINSTACK NODE URL'
web3 = Web3(Web3.HTTPProvider(node_url))
with open('TfiFeedRegistry.json', encoding='utf-8') as f:
    abi = json.load(f)
    address = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
    contract = web3.eth.contract(
        address=address, abi=abi['abi'])
    Chain_id = web3.eth.chain_id
    nonce = web3.eth.getTransactionCount(caller)

    call_function = contract.functions.setRoundData(
        "truflation.cpi.us",
        roundId,
        v,
        dts,
        nts
    ).buildTransaction({"chainId": Chain_id, "from": caller, "nonce": nonce})
    signed_tx = web3.eth.account.sign_transaction(
        call_function, private_key=private_key
    )
    send_tx = web3.eth.send_raw_transaction(
        signed_tx.rawTransaction
    )
    tx_receipt = web3.eth.wait_for_transaction_receipt(send_tx)
