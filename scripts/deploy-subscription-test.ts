import { ethers } from 'hardhat'

async function main (): void {
  const Contract = await ethers.getContractFactory('SubscriptionTest')
  const instance = await Contract.deploy()

  await instance.deployed()
  console.log(`contract deployed to ${instance.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
