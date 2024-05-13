#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/..

# This is a test environment that uses the hardhat local accounts
export TESTNET_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff08
export MAINNET_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export ETH_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export NODE_URL=http://localhost:8545/
export FEED_REGISTRY_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
export ETH_CALLER=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

# Define a function to clean up and kill all children
cleanup_and_exit() {
    echo "Interrupted. Killing all child processes."
    pgrep -P $$ | xargs kill
}

(npx hardhat node) &

echo "node started waiting...."
sleep 3
(npx hardhat --network localhost run ./scripts/deploy-feed-registry.ts)

# Trap interrupts and call our cleanup function
trap "cleanup_and_exit" INT  # Ctrl+C


for arg in "$@"
do
    echo "Setting role for $arg"
    python3 ./modules/feed-updater/feed_updater/setroles.py set $arg
done
sleep infinity

