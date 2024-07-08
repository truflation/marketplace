# How to add a new blockchain

* Add your blockchain to hardhat.config.ts
* Deploy the feed registry with deploy-feed-registry.ts
* Deploy a feed adapter with deploy-feed-adapter.ts set the ADDRESS to the registry address
  and the KEY to the the Truflation key
* For nightly CPI revisions use the key "truflation.cpi.us"
* For realtime EV revisions use the key "com_truflation_btc_ev" and "com_truflation_btc_ev_fiat"
* Let truflation know the caller and private key and we will start feeding data to the registry
