== Pull interface ==

User documentation available at

https://github.com/truflation/quickstart/

User interface available at

http://marketplace.truflation.com/

Backend code at

https://github.com/truflationdev/tfi-marketplace

https://github.com/truflation/tfi-adapter

* Contracts

** TfiOperator is a custom chainlink compatible oracle contract that
   has extensions that support variable pricing

** TruflationToken is a ERC677 token which is compatible with
   Chainlink servers

** tfi-marketplace/modules/orders is run by chainlink to process requests

* Security

** The web3 contracts are chainlink derived contracts requiring
   minimal security audits.  Most of the infrastructure consists of
   web2 interfaces called by the chainlink server which can be
   modified and are behind Chainlink server

** Because the data sources are behind the chainlink server, we can
   put in private data since the entire database is not on the
   blockchain.

* Workflow

Chainlink server -> Orders -> tfi-adapter -> Web2 call

== Push interface ==


tfi-marketplace/contracts/TfiFeedAdapter.sol

tfi-marketplace/blob/main/contracts/TfiFeedAdapter.sol

Runs with Chainlink AggregatorV2V3

* feed-updater is run and updates values in smart contracts.  This
  "pushes" data to the blockchain.

* Security

** Not officially released since we need a security audit.  In
  particularly, the system depends on one key to push the data and
  having a more robust security model is necessary.

** Other issue is privacy.  Anything that is pushed in the push model
   is available on the blockchain and can be screen scraped.  This is
   okay for our headline CPI numbers since those are already public,
   but this is going to be an issue for private data.
