# Truflation Feed Interface

The Truflation Feed interface to marketplace data is a push smart
contract that will allow users to access real time Truflation data via
the ChainLink AggregatorV2V3Interface.  The interface is designed to
allow easy integration of real time Truflation data to EVM compatible
blockchains.

The code is open source and released under the Simplified BSD License.

The interface consists of simple MVP that contains the following
components:

* The system will consist of one daemon, two contracts, and support scripts:
  * setdata-daemon.py - The daemon is located in modules/feed-updater
    and consists of a python daemon that takes web2 post calls and
    modifies the data in the TruflationFeedRegistry
  * TruflationFeedRegistry - which updates the value of the stored values and the
    contains a white list of contracts which are allowed to pull the
    value of the updated item.  The FeedRegistry can store multiple values.
  * TruflationFeedAdapter - which implements the AggregatorV2V3 interface and
    calls the TruflationFeedRegistry.
  * support scripts are located in modules/feed-adapter which sets the
    roles and allows manual set up of the system

## Local testing and deployment
  * A local test environment can be set up with the smart contracts by
    running scripts/initialize-testnet.sh to set up a testnet, then
    installing the python scripts under modules/feed-updater to run
    the daemon updater.
	
  * The deployment for the registry can be done with
    scripts/deploy-feed-contracts.ts.  Additional adapters can be deployed
    with scripts/deploy-feed-adapters.ts
	
## Integration with new blockchains

The system is designed to make it easy to integrate truflation
real-time data with EVM compatible blockchains.  To do so just deploy
the TruflationFeedAdapter and TruflationFeedRegistry and contact
truflation with the private key to the feed registry and we will
integrate these with our data feeds.

## Access control

* TruflationFeedRegistry will have three access lists:
  * an access list of contracts that are allowed to access a particular
    data element
  * an access list of contracts that are allowed to modify a particular
    data element
  * an access list of contracts that are allowed to proxy through
    TruflationFeedAdapter to access a particular data element

The permissions occurs as the feed registry and there is a permission
for get, set, proxy which is keyed per data item.  For set the
permission will only allow updates from a administrator account.

For set and proxy the contract will control access through the proxy
contract.  To get data the chain of calls will be

   user contract -> adapter -> feed registry

Note that users will always be able to access the data off-chain but
the access control will control the ability to get data on-chain.  For
the initial release we will be using the registry to distribute the
truflation headline numbers which are public.  However, this
permission model may not work for proprietary data feeds.

The access control should be separated out as separate smart contract
to allow custom and self service access control.

## Implementation

* The read/write parts of TruflationFeedRegistry are keyed to a
  string, and will be stored as a string -> uint256 map.  The map from
  string -> uint256 will be private

* TruflationFeedAdapter will have one superuser which will be allowed
  to change the address of the TruflationFeedRegistry and the
  parameter for reading TruflationFeedRegistry.  This superuser can be
  set up multisignature by a third party 

TruflationFeedAdapter will just call TruflationFeedRegistry and will
have no access control.  The reason TruflationFeedAdapter is necessary
is because TruflationFeedRegistry stores multiple items, and
TruflationFeedAdapter will pull a single item to fit the
AggregatorV2V3 interface

* Both TruflationFeedAdapter and TruflationFeedRegistry implemented as
  an upgradeableproxy to allow for upgrading of the contract

* TruflationFeedRegistry will issue an event whenever there is a new request for data

The code that was written for stage 1 will be adapted from the
  code that Binance uses to publish its prices at
  https://oracle.binance.com/docs/price-feeds/feed-adapter/
  specifically
  https://testnet.bscscan.com/address/0x1a26d803c2e796601794f8c5609549643832702c
The main change is that Binance takes two parameters BASE and QUOTE,
  whereas our contract will take only BASE.  Also the Binance contract
  reads data from a private external feed registry whereas our data
  will be written into the contract directly.
  
## Contract management

The contracts can be managed in several different modes

* truflation manages both the adapter and registry - This would be the
  case in which a data provider wants a complete solution.
  
* truflation manages registry, client manages adapter - This would be
  the case in which the client has special needs and would like to
  modify the adapter to for example deal with special access control
  features.
  
* client manages both registry and adapter - This would be the case in
  which you have a new blockchain which wishes to use truflation as a
  data partner

## ChainLink integration

The system can be scaled by having using chainlink automation and
having the chainlink server automatically update the oracle via CL
automation or via an event driven oracle.  

* The setdata-daemon can be integrated into a chainlink oracle
  allowing custom information to be pushed through the interface

* The TruflationFeedRegistry can issue an event which is readable via
  a ChainLink server
