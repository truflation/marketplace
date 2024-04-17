#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_DIR/..
# Define a function to clean up and kill all children
cleanup_and_exit() {
    echo "Interrupted. Killing all child processes."
    pgrep -P $$ | xargs kill
}

(npx hardhat node) &

echo "node started waiting...."
sleep 3
(npx hardhat --network localhost run ./scripts/deploy-feed-contracts.ts)

# Trap interrupts and call our cleanup function
trap "cleanup_and_exit" INT  # Ctrl+C

for arg in "$@"
do
    echo "Setting role for $arg"
    python3 ./modules/feed-updater/feed_updater/setroles.py set $arg
done
sleep infinity

