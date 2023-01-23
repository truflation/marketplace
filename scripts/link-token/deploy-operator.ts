import { ethers, upgrades } from 'hardhat'
import { getConfig } from '../config'

const address = getConfig()
async function main (): void {
  const TfiOperator = await ethers.getContractFactory('TfiOperator')
  const tfiOperator =
        await upgrades.deployProxy(
          TfiOperator, [
            address.link.token,
            address.owner
          ], {
            unsafeAllow: ['delegatecall']
          })

  await tfiOperator.deployed()
  console.log(`operator deployed to ${tfiOperator.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
