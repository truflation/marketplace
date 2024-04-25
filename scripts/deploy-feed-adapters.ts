// SPDX-License-Identifier: MIT
import { ethers, upgrades } from 'hardhat'
import { TfiFeedAdapter } from '../typechain'

async function main(): Promise<void> {
  try {
    const address = process.env.ADDRESS
    const keyString = process.env.KEY
    const [owner] = await ethers.getSigners()
    
    if (!address || !keyString) {
      throw new Error('Address or key is missing. Exiting.')
    }
    const TfiFeedRegistry = await ethers.getContractFactory('TfiFeedRegistry');
    const tfiFeedRegistry = TfiFeedRegistry.attach(address)
    
    console.log('Deploying TfiAdapter')
    console.log(`   Owner ${owner.address}`)
    console.log(`   Address ${address}`)
    console.log(`   Key ${keyString}`)
    const key = ethers.encodeBytes32String(keyString)    
    const TfiFeedAdapter = await ethers.getContractFactory(
      'TfiFeedAdapter'
    )
    const tfiFeedAdapter = await upgrades.deployProxy(
      TfiFeedAdapter, [
	address,
	key
      ], {
	initializer: 'initialize'
      }
    )
    await tfiFeedAdapter.waitForDeployment() 
    console.log('TfiFeedAdapter deployed to:', await tfiFeedAdapter.getAddress())
    const getKey = ethers.encodeBytes32String('get');
    await tfiFeedRegistry.setAccess(
      getKey, key, await tfiFeedAdapter.getAddress(), true
    )
    console.log('Roles granted')
  } catch(error) {
    console.error(error)
  }
}

main();
