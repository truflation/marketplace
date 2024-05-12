// SPDX-License-Identifier: MIT
import { ethers, upgrades } from 'hardhat'
import { TruflationFeedAdapter } from '../typechain'

async function main(): Promise<void> {
  try {
    const address = process.env.ADDRESS
    const keyString = process.env.KEY
    const [owner] = await ethers.getSigners()
    
    if (!address || !keyString) {
      throw new Error('Address or key is missing. Exiting.')
    }
    const TruflationFeedRegistry = await ethers.getContractFactory('TruflationFeedRegistry');
    const truflationFeedRegistry = TruflationFeedRegistry.attach(address)
    
    console.log('Deploying TruflationAdapter')
    console.log(`   Owner ${owner.address}`)
    console.log(`   Address ${address}`)
    console.log(`   Key ${keyString}`)

    const TruflationFeedAdapter = await ethers.getContractFactory(
      'TruflationFeedAdapter'
    )
    const truflationFeedAdapter = await upgrades.deployProxy(
      TruflationFeedAdapter, [
	address,
	key
      ], {
	initializer: 'initialize'
      }
    )
    await truflationFeedAdapter.waitForDeployment()
    console.log('TruflationFeedAdapter deployed to:',
		await truflationFeedAdapter.getAddress())
    const key = ethers.encodeBytes32String(keyString)
    const getKey = ethers.encodeBytes32String('get')
    const setKey = ethers.encodeBytes32String('set')
    const proxyKey = ethers.encodeBytes32String('proxy')

    await truflationFeedRegistry.setAccess(
      getKey, key, await truflationFeedAdapter.getAddress(),
      true
    )
    await truflationFeedRegistry.setAccess(
      proxyKey, key, await truflationFeedAdapter.getAddress(),
      true
    )
    await truflationFeedRegistry.setAccess(
      getKey, key, owner.address, true
    )
    await truflationFeedRegistry.setAccess(
      setKey, key, owner.address, true
    )

    console.log('Roles granted')
  } catch(error) {
    console.error(error)
  }
}

main();
