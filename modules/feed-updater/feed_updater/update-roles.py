from web3 import Web3
from eth_account import Account
from eth_account.signers.local import LocalAccount

# Set up Web3 connection to Ethereum network
w3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/<your_infura_project_id>'))

# Set up contract addresses and ABIs
registry_address = '<TfiFeedRegistry_contract_address>'
registry_abi = [
    {
        "inputs": [],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_admin",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_feeder",
                "type": "address"
            }
        ],
        "name": "setRoles",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# Set up account and private key
private_key = '<your_private_key_here>'
account = Account.from_key(private_key)

# Set up contract instance
registry = w3.eth.contract(address=registry_address, abi=registry_abi)

# Set up transaction parameters
admin_address = '<new_admin_address_here>'
feeder_address = '<new_feeder_address_here>'
gas_price = w3.eth.gas_price
gas_limit = 500000

# Create and sign transaction
transaction = registry.functions.setRoles(admin_address, feeder_address).buildTransaction({
    'from': account.address,
    'nonce': w3.eth.getTransactionCount(account.address),
    'gasPrice': gas_price,
    'gas': gas_limit
})
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)

# Send transaction to the network
tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
print('Transaction sent:', tx_hash.hex())


