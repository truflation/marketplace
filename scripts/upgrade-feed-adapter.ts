// deploy upgradeable client

import { ethers, upgrades } from 'hardhat'
import { getConfig } from './config'
const address = process.env.ADDRESS ?? getConfig().feed_adapter

async function main (): void {
  const name = 'TruflationFeedAdapter'
  const contract = await ethers.getContractFactory(name)
  const inst = await upgrades.upgradeProxy(
    address,
    contract
  )
  await inst.waitForDeployment()
  console.log(`${name} deployed to ${inst.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
