let SubscriptionManagerAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "previousAdmin",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "newAdmin",
                "type": "address"
            }
        ],
        "name": "AdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "beacon",
                "type": "address"
            }
        ],
        "name": "BeaconUpgraded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "version",
                "type": "uint8"
            }
        ],
        "name": "Initialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "implementation",
                "type": "address"
            }
        ],
        "name": "Upgraded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "subscriber",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "clientAddr",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "expiredDate",
                "type": "uint256"
            }
        ],
        "name": "addClientAddressByOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "channel",
                "type": "address"
            }
        ],
        "name": "addPaymentChannel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "extendPeriod",
                "type": "uint256"
            }
        ],
        "name": "addSubscriptionPeriod",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "subscriber",
                "type": "address"
            }
        ],
        "name": "getClientAddressOfSubscriber",
        "outputs": [
            {
                "internalType": "address",
                "name": "clientAddress",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "subscriber",
                "type": "address"
            }
        ],
        "name": "getSubscriptionExpiryDate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getVersion",
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
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "subscriber",
                "type": "address"
            }
        ],
        "name": "isSubscriber",
        "outputs": [
            {
                "internalType": "bool",
                "name": "accessible",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "paymentChannels",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "proxiableUUID",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "channel",
                "type": "address"
            }
        ],
        "name": "removePaymentChannel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
            }
        ],
        "name": "setSubscriptionProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "dataString1",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "dataString2",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "dataInt",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "dataAddress",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "dataBytes",
                "type": "bytes"
            }
        ],
        "name": "subscriptionStatus",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "errorCode",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "subscriber",
                "type": "address"
            }
        ],
        "name": "terminateSubscriptionInForce",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "productId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "clientAddr",
                "type": "address"
            }
        ],
        "name": "updateClientAddressBySubscriber",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newImplementation",
                "type": "address"
            }
        ],
        "name": "upgradeTo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newImplementation",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "upgradeToAndCall",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]
