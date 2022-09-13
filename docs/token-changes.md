The tokens are intended to be functionally equivalent to the ERC-677
compliant chainlink tokens, and to not contain any logic changes.
Auditing the code should consist of making sure that there are no
functional changes from the original chainlink sources.

The tokens are modified from the ERC-677 chainlink tokens in

https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src/v0.4

with the following changes.

- Renamed chainlink token to tfi token
- Copied dependencies into contract
