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
    
    console.log('Deploying TfiAdapter')
    console.log(`   Owner ${owner.address}`)
    console.log(`   Address ${address}`)
    console.log(`   Key ${keyString}`)
    const key = ethers.encodeBytes32String(keyString)    
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
    const getKey = ethers.encodeBytes32String('get');
    await truflationFeedRegistry.setAccess(
      getKey, key, await truflationFeedAdapter.getAddress(), true
    )
    const proxyKey = ethers.encodeBytes32String('proxy');
    await truflationFeedRegistry.setAccess(
      proxyKey, key, await truflationFeedAdapter.getAddress(), true
    )
    console.log('Roles granted')
  } catch(error) {
    console.error(error)
  }
}

main();
