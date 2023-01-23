// deploy upgradeable client

import { ethers, upgrades } from 'hardhat'
import { getConfig } from '../config'

const address = getConfig()
async function main (): void {
  const name = 'TfiExample'
  const contract = await ethers.getContractFactory(name)
  const inst = await upgrades.deployProxy(contract, [
    address.link.operator,
    address.jobid,
    '1000000000000000000', // 1 LINK
    address.link.token
  ])

  await inst.deployed()
  console.log(`${name} deployed to ${inst.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
