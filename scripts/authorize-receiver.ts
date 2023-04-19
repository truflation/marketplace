import { ethers } from 'hardhat'
import { getConfig } from './config'
const address = getConfig()

async function main (): void {
  const name = 'TfiOperator'
  const Contract = await ethers.getContractFactory(name)
  console.log(address)
  const instance = await Contract.attach(address.link.operator)
  console.log(`contract deployed to ${instance.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
