import { ethers } from 'hardhat'

async function main (): void {
  const Token =
    await ethers.getContractFactory('TruflationToken')
  const token =
    await Token.deploy()

  await token.deployed()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
