// deploy upgradeable client

import { ethers, upgrades } from 'hardhat'
import { getConfig } from './config'
const address = process.env.ADDRESS ?? getConfig().feed_registry

async function main (): void {
  const name = 'TruflationFeedRegistry'
  const contract = await ethers.getContractFactory(name)
  const inst = await upgrades.upgradeProxy(
    address,
    contract
  )
  await inst.waitForDeployment()
  console.log(`${name} deployed to ${await inst.getAddress()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
