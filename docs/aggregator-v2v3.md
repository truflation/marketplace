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

* it will implement an instance of AggregatorV2V3interface

* it will allow for manual updates of the data to be pulled.  The code
  that will be written for stage 1 will be adapted from the code that
  Binance uses to publish its prices at
  https://oracle.binance.com/docs/price-feeds/feed-adapter/ specifically
  https://testnet.bscscan.com/address/0x1a26d803c2e796601794f8c5609549643832702c
  The main change is that Binance takes two parameters BASE and QUOTE, whereas
  our contract will take only BASE.  Also the Binance contract reads data
  from a private extrernal feed registry whereas our data will be written
  into the contract directly

* it will implement a white list of contracts that are allowed to use
  the code.  The whitelist will allow for payments to be performed
  off-chain.

* The contract will be deployed only on the Arbitrum and Arbitrum Test

* it will be implemented as an upgradeableproxy to allow for upgrading
  of the contract

* it will issue an event whenever there is a new request for data

* it will contain parameters in the constructor that will allow for
  future integration with ChainLink

In stage 1, the value in the contract will be updated via a simple
cron daemon

Stage 2 - Integration with ChainLink

Once the MVP is created the system can be scaled by having using
chainlink automation and having the chainlink server automatically
update the oracle via CL automation or via an event driven oracle.

In order to support the future integration, the contract will have
added the TFI parameters which are needed to query TFI data services,
although these parameters will be unused for Stage 1.

Stage 2 will also automatically handle payments using web3
infrastructure.