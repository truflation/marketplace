Marketplace

TODO
----

In order to deploy to base we had to update to new hardhat proxy
syntax and do an upgrade of hardhat.  This means that some of the
deploy scripts need to be updated.

scripts/tfi-token have the updated scripts

create .env files with

* MAINNET_PRIVATE_KEY
* TESTNET_PRIVATE_KEY
* INFURA_API_KEY
* ETHERSCAN_API_KEY

To run
------
yarn install
yarn build
yarn test


To deploy
---------

* edit scripts/config.js
* npx hardhat run (deploy script) --network <network>
* npx hardhat verify --network <network> <contract address> <constructor parameters>


change password in chainnode

create bridges

test -> http://api-adapter:8080/
main

Run

docker-compose up
