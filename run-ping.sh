#!/usr/bin/env bash
set -v
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR

chains=(
    'goerli'
    'arbitrumTestnet' 'bscTestnet' 'polygonMumbai' 'avalancheFujiTestnet'
    'ftmTestnet' 
)

for chain in "${chains[@]}"; do
    npx hardhat test --network $chain test-chain/ping.ts >& logs/$chain-ping.$$.log &
done

wait $(jobs -rp)
cat logs/*-ping.$$.log

