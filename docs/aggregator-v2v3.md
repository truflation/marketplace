The aggregator interface to marketplace data is an smart contract that
will allow users to access the Truflation data via the ChainLink
AggregatorV2V3Interface.

Development will be split into a simple MVP that will allow users to
access the daily US CPI information. The Stage 1 MVP will manually
update the US CPI number based on a nightly daemon which is run by the
truflation API.  The payments for the use of the nightly daemon will
be processed off-chain.

Stage 2 will connect the smart contract with the Truflation chainlink
infrastructure to allow automatic updates and allow for automatic
payments.

The first stage will create a simple MVP that contain the
following features:

* The system will consist of two contracts and one daemon:
  * TfiFeedRegistry - which updates the value of the stored values and the
    contains a white list of contracts which are allowed to pull the
    value of the updated item.  The FeedRegistry can store multiple values.
  * TfiFeedAdapter - which implements the AggregatorV2V3 interface and
    calls the TfiFeedRegistry.
  * The system will also contain a daemon which will read the current
    inflation value nightly and update the TfiFeedRegistry

* TfiFeedRegistry will have two access lists:
  * an access list of contracts that are allowed to access a particular
    data element
  * an access list of contracts that are allowed to modify a particular
    data element
  * both read/write will contain a global switch that will allow read/write
    for everyone
  * the superuser will be allowed to change either access list
  * the access lists will be public

* The read/write parts of TfiFeedRegistry will be keyed to a string,
  and will be stored as a string -> uint256 map.  The map from string ->
  uint256 will be private

* TfiFeedAdapter will have one superuser which will be allowed to
  change the address of the TfiFeedRegistry and the parameter for reading
  TfiFeedRegistry

The whitelist will allow for payments to be performed off-chain.

TfiFeedAdapter will just call FeedRegistry and will have no access
control.  The reason TfiFeedAdapter is necessary is because
TfiFeedRegistry stores multiple items, and TfiFeedAdapter will pull
a single item to fit the AggregatorV2V3 interface

* The contract will be deployed only on the Arbitrum and Arbitrum Test,
  and will output only the nightly US CPI information.

* Both FeedAdapter and FeedRegistry implemented as an upgradeableproxy
  to allow for upgrading of the contract

* FeedRegistry will issue an event whenever there is a new request for data

The code that will be written for stage 1 will be adapted from the
  code that Binance uses to publish its prices at
  https://oracle.binance.com/docs/price-feeds/feed-adapter/
  specifically
  https://testnet.bscscan.com/address/0x1a26d803c2e796601794f8c5609549643832702c
The main change is that Binance takes two parameters BASE and QUOTE,
  whereas our contract will take only BASE.  Also the Binance contract
  reads data from a private extrernal feed registry whereas our data
  will be written into the contract directly.

We will be able to deliver the interface to the client for initial
testing on close of business 4/19.

Permissions

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

Stage 2 - ChainLink integration

Stage 2 will allow the client to gain access to other data from
truflation in a scaleable manner.

Once the MVP is created the system can be scaled by having using
chainlink automation and having the chainlink server automatically
update the oracle via CL automation or via an event driven oracle.
This can be done via a subclass of TfiFeedRegistry.  The division between
TfiFeedAdapter and TfiFeedRegistry will allow TfiFeedRegistry to be updated
without changing existing interfaces with TfiFeedAdapter.

The TfiFeedRegistry can be modified to issue an event which CL reads
and then updates the data element.
