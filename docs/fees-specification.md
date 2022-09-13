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

sender: This is the contract or wallet that initiated the request

1) The client sends to the oracle operator the fee to be transfered
2) the adapter will based on the data provided return the data and the fee to
   be returned.  If the fee is insufficient to conduct the transaction the
   fee will be canceled.
3) If the cost of the transaction is below the fee sent, the oracle will
   refund the fee to the refund address
4) If the number of blocks exceeds the timeout then the user can force
   a refund of the total fees to refund address.  Once a refund has been
   processed the system will ignore any responses from the adapter.

note that there is a security consideration in that the adapter data
calculations are performed off chain, so the coins should be in the
custody of the oracle before the calculation is performed.

Fee query
---------

The current mechanism provides only a means of charging fees, but
there is no on-chain mechanism for querying the fee.  This should be
done off-chain, and the user can prevent overcharging by limiting the
tokens sent to the adapter.

