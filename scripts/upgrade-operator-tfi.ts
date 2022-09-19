// deploy upgradeable client

import { ethers, upgrades } from 'hardhat'
import { address } from './config'

async function main (): void {
  const name = 'TfiOperator'
  const contract = await ethers.getContractFactory(name)
  const inst = await upgrades.upgradeProxy(
    address.operator_tfi,
    contract, {
      unsafeAllow: ['delegatecall']
    }
  )
  await inst.deployed()
  console.log(`${name} deployed to ${inst.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
