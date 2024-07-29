#!/usr/bin/env python3

from web3 import Web3
w3 = Web3()
acc = w3.eth.account.create()
print(f'private key={w3.to_hex(acc._private_key)}')
print(f'account={acc.address}')

