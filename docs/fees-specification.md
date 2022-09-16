Requirements
------------

The fee infrastructure is a set of smart contracts that allows data
providers to charge different fees based on different data requests
and based on different prices, and to control access to data based on
the identity of the user.

Protocol
--------

The request contains the following data:

feeMaximum; the maximum fee the contract is willing to pay
feeRefundAddress: address to send unused fees
feeTimeout: The fee can be refunded and the transaction will be
   canceled if the fee is not returned within the period with 0 indicating
   no time out

The request will also send to the server;

sender: This is the contract or wallet that sent the request - see msg.sender
origin; This is the wallet that originated the request - see tx.origin

1) The client sends to the oracle operator the fee to be transfered
2) The operator issues an event that is seen by the node server
3) The node server will call a fee server that will return a json structure
   containing:
     - fee paid
     - fee charged
     - fee refunded
     - address to refund
     - bridge to call
4) The node will return the transaction the oracle which will then transfer the
   coins to the refund address

Security issues
---------------

need to be careful that the refund address is not spoofed to force a
refund.  There are possible timing issues that can be used to drain
wallets.

note that there is a security consideration in that the adapter data
calculations are performed off chain, so the coins should be in the
custody of the oracle before the calculation is performed.

Fee query
---------

The current mechanism provides only a means of charging fees, but
there is no on-chain mechanism for querying the fee.  This should be
done off-chain, and the user can prevent overcharging by limiting the
tokens sent to the adapter.

