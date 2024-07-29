# How to add a new blockchain

* Add your blockchain to hardhat.config.ts
* Deploy the feed registry with deploy-feed-registry.ts
  - npx hardhat --network <networkName> run scripts/deploy-feed-registry.ts 
* Deploy a feed adapter with deploy-feed-adapter.ts set the ADDRESS to the registry address
  - ADDRESS=<address> KEY=<KEYNAME> npx hardhat --network <networkName> run scripts/deploy-feed-adapter.ts 

  and the KEY is the name of the data that you want to retrieve using the adapter (not the private key)
** For nightly CPI revisions use the key "truflation.cpi.us"
** For realtime EV revisions use the key "com_truflation_btc_ev" and "com_truflation_btc_ev_fiat"


* cd marketplace/modules/feed-updater
* build the docker image
  - docker compose build
* modify the config file
  - the default files runs against a local testnet which you can run with
     ./scripts/initialize-testnet.sh truflation.cpi.us
* run the docker image with 
  - docker compose up