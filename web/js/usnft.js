
const CurrencyTokenAddress = "0x3417dd955d4408638870723B9Ad8Aae81953B478";//Truflation Token
const SubscriptionTicketManagerAddress = "0xfB3FbBadF5E0d2F404CD32d665dAcBFd88498ED7";
const SubscriptionManagerAddress = "0xE4d8cbFbaA00f0D34a4a9c5a8dd5dE361b912ef6";
const PackagePlanPaymentAddress = "0xCc18942eA7B780040E1Bd0e3160842aFA82FAE1D";
//const AutoRenewPaymentAddress = "0x7160C7848Eb3965e65A256A8Ce597877F864a172";

const descBox = document.getElementById('buy-announce');
const enableEthereumButton = document.getElementById('enable-button');
//const DataPackageRadios = document.getElementsByName('data-pack');
const DataPackageRadios = document.querySelectorAll('input[type=radio][name="data-pack"]');
const BuyPackageButton = document.getElementById('buy-package-button');

const TicketListTable = document.getElementById('ticket-table');
const TicketListOptions= document.getElementById('ticket-options');

const ClientAddress = document.getElementById('client-address');
const UpdateAddressButton = document.getElementById('update-address-button');
const newClientAddressInput = document.getElementById('new-client-address');
const renewButton = document.getElementById('renew-button');
const terminateButton = document.getElementById('terminate-button');

const durationInput = document.getElementById('duration');
const packagePrice = document.getElementById('package-price');
let accounts;
let provider;
let tokenList = [];
let tokenInfoMap = new Map();

//let CurrencyContract;

enableEthereumButton.onclick = async () => {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  console.log(accounts);
  console.log(accounts[0]);

};

DataPackageRadios.forEach(radio => radio.addEventListener('change', async() => {
  //alert('selected price: ' + document.querySelector('input[type=radio][name="data-pack"]:checked')?.value);
  //alert('selected price: ' + radio.id);
  packagePrice.innerHTML = radio.value * durationInput.value;
  packagePrice.value = radio.value * durationInput.value;
}));

durationInput.addEventListener('change', async() =>   {
  packagePrice.innerHTML = ((document.querySelector('input[type=radio][name="data-pack"]:checked')?.value)*durationInput.value).toString();
  packagePrice.value = (document.querySelector('input[type=radio][name="data-pack"]:checked')?.value)*durationInput.value;
});

BuyPackageButton.onclick = async () => {
  const signer = await provider.getSigner();
  let signerAddress = await signer.getAddress();
  const PackagePlanPaymentContract = new ethers.Contract(PackagePlanPaymentAddress, PackagePlanPaymentV2Abi, signer);
  const CurrencyContract = new ethers.Contract(CurrencyTokenAddress, erc20Abi, signer);

  //TODO only ask approval when allowance amount is not sufficient for payment
  console.log(packagePrice.value);
  let isApproved = await tokenAllowanceCheck(PackagePlanPaymentAddress,packagePrice.value);
  if(!isApproved){
    await CurrencyContract.approve(PackagePlanPaymentAddress, ethers.constants.MaxUint256);
    console.log('Approve');
  }
  console.log(signerAddress);
  console.log(document.querySelector('input[type=radio][name="data-pack"]:checked')?.id);
  let periodId = document.querySelector('input[type=radio][name="data-pack"]:checked')?.id;
  await PackagePlanPaymentContract.purchasePackage(ProductId, periodId, durationInput.value);
  //await PackagePlanPaymentContract.startSubscription(signerAddress, parseInt(periodId), parseInt(durationInput.value));
  BuyPackageButton.disabled = true;
};

TicketListOptions.addEventListener('change', async() =>   {

  if(TicketListOptions.value != ""){
    let tokenItem = tokenInfoMap.get(TicketListOptions.value);
    ClientAddress.innerHTML = tokenItem.clientAddr;
    UpdateAddressButton.disabled = false;
    //TODO fetch auto renew status
  }


});



// subscribeButton.onclick = async () => {
//   const signer = await provider.getSigner();
//   let signerAddress = await signer.getAddress();
//   console.log('signer: ' + signerAddress);
//
//   const SubscriptionPaymentContract = new ethers.Contract(SubscriptionPaymentAddress, SubscriptionPaymentAbi, signer);
//   const CurrencyContract = new ethers.Contract(CurrencyTokenAddress, erc20Abi, signer);
//
//   let isApproved = await tokenAllowanceCheck(SubscriptionPaymentAddress,packagePrice.value);
//   if(!isApproved){
//     await CurrencyContract.approve(SubscriptionPaymentAddress, ethers.constants.MaxUint256);
//     console.log('Approve');
//   }
//   console.log('subscription');
//   await SubscriptionPaymentContract.startSubscription(ProductId);
//   subscribeButton.disabled = true;
//   terminateButton.disabled = false;
//
// };


// terminateButton.onclick = async () => {
//   const signer = await provider.getSigner();
//   let signerAddress = await signer.getAddress();
//   console.log('signer: ' + signerAddress);
//
//   const SubscriptionPaymentContract = new ethers.Contract(SubscriptionPaymentAddress, SubscriptionPaymentAbi, signer);
//   await SubscriptionPaymentContract.terminateSubscription(ProductId);
//
//   renewButton.disabled = false;
//   terminateButton.disabled = true;
//
// };

UpdateAddressButton.onclick = async () => {
  const signer = await provider.getSigner();
  let signerAddress = await signer.getAddress();
  console.log('signer: ' + signerAddress);

  const SubscriptionTicketManagerContract = new ethers.Contract(SubscriptionTicketManagerAddress, SubscriptionTicketManagerAbi, signer);
  console.log(newClientAddressInput.value);
  console.log(TicketListOptions.value);
  await SubscriptionTicketManagerContract.updateClientAddress(TicketListOptions.value, newClientAddressInput.value);


};


async function setupSubscriberStatus() {
  //const SubscriptionPaymentContract = new ethers.Contract(SubscriptionPaymentAddress, SubscriptionPaymentAbi, provider);
  const SubscriptionManagerContract = new ethers.Contract(SubscriptionManagerAddress, SubscriptionManagerV4Abi, provider);
  const PackagePlanPaymentContract = new ethers.Contract(PackagePlanPaymentAddress, PackagePlanPaymentV2Abi, provider);
  const SubscriptionTicketManagerContract = new ethers.Contract(SubscriptionTicketManagerAddress, SubscriptionTicketManagerAbi, provider);
  const signerAddress = await provider.getSigner().getAddress();
  console.log(signerAddress);
  let balance = await SubscriptionTicketManagerContract.balanceOf(signerAddress);
  console.log(balance.toString());
  for (let i=0; i<balance; i++) {
    let tokenId = await SubscriptionTicketManagerContract.tokenOfOwnerByIndex(signerAddress, i);
    let subscriptionInfo = await SubscriptionTicketManagerContract.getSubscriptionInfo(tokenId);
    let clientAddr = await SubscriptionTicketManagerContract.getClientAddress(tokenId);
    let tokenItem = {
      tokenId: tokenId,
      productId: subscriptionInfo.productId,
      startDate: subscriptionInfo.startTime,
      endDate: subscriptionInfo.endTime,
      clientAddr: clientAddr
    }
    console.log(tokenItem);
    if (tokenItem.productId == ProductId && tokenItem.endDate <= Date.now()) {
      tokenList.push(tokenItem);
      tokenInfoMap.set(tokenId.toString(), tokenItem);
    }
  }

  for (let i=0; i<tokenList.length; i++){
    let tr;

    function createTd(content) {
      let td = document.createElement('td');
      td.appendChild(document.createTextNode(content));
      tr.appendChild(td);
    }

    tr = document.createElement('tr'); // Create a new row for each book
    createTd(tokenList[i].tokenId);
    createTd( (new Date(tokenList[i].startDate*1000)).toLocaleDateString());
    createTd( (new Date(tokenList[i].endDate*1000)).toLocaleDateString());
    createTd("false");
    TicketListTable.appendChild(tr);
  }



  for(let i=0; i<tokenList.length; i++){
    let option = document.createElement("option");
    option.text = tokenList[i].tokenId;
    option.value = tokenList[i].tokenId;
    TicketListOptions.appendChild(option);
  }


  let dailyFee = parseInt(ethers.utils.formatEther(await PackagePlanPaymentContract.getProductFee(ProductId, 1)));
  let weeklyFee = parseInt(ethers.utils.formatEther(await PackagePlanPaymentContract.getProductFee(ProductId, 2)));
  let monthlyFee = parseInt(ethers.utils.formatEther(await PackagePlanPaymentContract.getProductFee(ProductId, 3)));
  let yearlyFee = parseInt(ethers.utils.formatEther(await PackagePlanPaymentContract.getProductFee(ProductId, 4)));
  document.getElementById('1').value = dailyFee;
  document.getElementById('2').value = weeklyFee;
  document.getElementById('3').value = monthlyFee;
  document.getElementById('4').value = yearlyFee;
  document.getElementById('daily_fee').innerHTML = dailyFee;
  document.getElementById('weekly_fee').innerHTML = weeklyFee;
  document.getElementById('monthly_fee').innerHTML = monthlyFee;
  document.getElementById('yearly_fee').innerHTML = yearlyFee;
  packagePrice.innerHTML = (document.querySelector('input[type=radio][name="data-pack"]:checked')?.value*durationInput.value).toString();
  packagePrice.value = document.querySelector('input[type=radio][name="data-pack"]:checked')?.value*durationInput.value;

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

async function tokenAllowanceCheck(spender, amount)  {
  const CurrencyContract = new ethers.Contract(CurrencyTokenAddress, erc20Abi, provider);
  let allowance = await CurrencyContract.allowance(window.ethereum.selectedAddress, spender);
  console.log('allowance: ', allowance.toString());
  console.log('amount: ', amount);
  console.log(allowance >= amount);
  return allowance >= amount;
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

