
const CurrencyTokenAddress = "0x3417dd955d4408638870723B9Ad8Aae81953B478";//Truflation Token
const SubscriptionPaymentAddrress = "0x3C459b20Cca175AC4ccCe26545327048c695Af80";
const subscribeButton = document.getElementById('subscribe-button');
const terminateButton = document.getElementById('terminate-button');
//const transferAddressInput = document.getElementById('transfer-address');

const descBox = document.getElementById('buy-announce');
const enableEthereumButton = document.getElementById('enable-button');
let accounts;
let provider;

let CurrencyContract;

enableEthereumButton.onclick = async () => {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  console.log(accounts);
  console.log(accounts[0]);

};



subscribeButton.onclick = async () => {
  const signer = await provider.getSigner();
  let signerAddress = await signer.getAddress();
  console.log('signer: ' + signerAddress);

  const SubscriptionPaymentContract = new ethers.Contract(SubscriptionPaymentAddrress, SubscriptionPaymentAbi, signer);
  const CurrencyContract = new ethers.Contract(CurrencyTokenAddress, erc20Abi, signer);

  //TODO only ask approval when allowance amount is not sufficient for payment
  console.log('Approve');
  await CurrencyContract.approve(SubscriptionPaymentAddrress, ethers.constants.MaxUint256)
  console.log('subscription');
  await SubscriptionPaymentContract["startSubscription()"]();

};


terminateButton.onclick = async () => {
  const signer = await provider.getSigner();
  let signerAddress = await signer.getAddress();
  console.log('signer: ' + signerAddress);

  const SubscriptionPaymentContract = new ethers.Contract(SubscriptionPaymentAddrress, SubscriptionPaymentAbi, signer);

  await SubscriptionPaymentContract.terminateSubscription();

};


async function setupSubscriberStatus() {
  const SubscriptionPaymentContract = new ethers.Contract(SubscriptionPaymentAddrress, SubscriptionPaymentAbi, provider);

  let isSubscriber = await SubscriptionPaymentContract.subscribers(window.ethereum.selectedAddress);
  let expiryDate = await SubscriptionPaymentContract.getSubscriptionExpiryDate(window.ethereum.selectedAddress);;
  console.log(window.ethereum.selectedAddress + ": " + isSubscriber);
  if(expiryDate >= Date.now() / 1000){
    document.getElementById('expire_date').innerHTML = (new Date(expiryDate*1000)).toLocaleDateString();
  } else {
    document.getElementById('expire_date').innerHTML = "N/A";
  }
  document.getElementById('isSubscriber').innerHTML = isSubscriber;
  if(isSubscriber){
    document.getElementById('bill_notice').style.display = "block";
  }

}

async function isMetaMaskConnected()  {
  accounts = await provider.listAccounts();
  console.log('account[0]: ' + accounts[0]);
  console.log('account length: ' + accounts.length);
  return accounts.length > 0;
}

async function getTokenBalance(tokenAddress, accountAddress) {
  const erc20Contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
  let bal = await erc20Contract.balanceOf(accountAddress);
  let decimals = await erc20Contract.decimals();
  console.log('balance of token: ', ethers.utils.formatUnits(bal, decimals));
  return ethers.utils.formatUnits(bal, decimals);

  // let tokenBal = (balance/Math.pow(10, unit)).toFixed(3);

}


async function tokenHoldCheck()  {
  let balance = await getTokenBalance(CurrencyTokenAddress, window.ethereum.selectedAddress);
  console.log('balance: ', balance)
  return balance >= 1200;
}



window.addEventListener('load', async (event) => {

  provider = new ethers.providers.Web3Provider(window.ethereum);

  let connected = await isMetaMaskConnected();
  if (connected){
    // metamask is connected
    console.log('metamask is connected to ' + window.ethereum.selectedAddress);
    enableEthereumButton.disabled = true;
    enableEthereumButton.innerHTML = window.ethereum.selectedAddress;

    await setupSubscriberStatus();
    let isTokenHolder = await tokenHoldCheck();
    if(!isTokenHolder){
      descBox.style.display = "block";
      console.log('user do not hold token');
      document.getElementById('token_address').innerHTML = CurrencyTokenAddress;
    }

    //TODO check token is approved for transfer


    console.log('Loading');

  } else{
    // metamask is not connected
    console.log('metamask is not connected');
    document.getElementById('metamask-announce').style.display = "block";
  }

  console.log('Completed');




});

