
const CurrencyTokenAddress = "0x3417dd955d4408638870723B9Ad8Aae81953B478";//Truflation Token
const SubscriptionTicketManagerAddress = "0x3a36Faad3b408034637eBC52e080049535A43335";
const TicketURIDescriptorAddress = "0x1644Bd0aA1c352F7FeD778b86692dEf75204E245";
const SubscriptionManagerAddress = "0xdB87C3424638E9Fd4ADc8c9171520C390eFCb13d";
const PackagePlanPaymentAddress = "0x3d74674Db0d23DF3E8F3704b4dE9c935bc0c4D78";
const AutoRenewPaymentAddress = "0x82DD728630DD78fBE24c06f66812453D497Eaa7a";

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
let dailyFee, weeklyFee, monthlyFee, yearlyFee;
let provider;
let signer;
let tokenList = [];
let tokenInfoMap = new Map();
let SubscriptionManager, PackagePlanPayment, SubscriptionTicketManager;
//let CurrencyContract;

enableEthereumButton.onclick = async () => {
  //provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  console.log('connect to metamask', accounts);

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

  console.log('signer: ', await signer.getAddress());
  const PackagePlanPaymentContract = new ethers.Contract(PackagePlanPaymentAddress, PackagePlanPaymentAbi, signer);
  const CurrencyContract = new ethers.Contract(CurrencyTokenAddress, erc20Abi, signer);

  //TODO only ask approval when allowance amount is not sufficient for payment
  console.log(packagePrice.value);
  let isApproved = await tokenAllowanceCheck(PackagePlanPaymentAddress,packagePrice.value);
  if(!isApproved){
    await CurrencyContract.approve(PackagePlanPaymentAddress, ethers.constants.MaxUint256);
    console.log('Approve');
  }

  console.log('Selected periodId', document.querySelector('input[type=radio][name="data-pack"]:checked')?.id);
  let periodId = document.querySelector('input[type=radio][name="data-pack"]:checked')?.id;
  await PackagePlanPaymentContract.purchasePackage(ProductId, periodId, durationInput.value);
  BuyPackageButton.disabled = true;
};

TicketListOptions.addEventListener('change', async() =>   {

  if(TicketListOptions.value != ""){
    let tokenItem = tokenInfoMap.get(TicketListOptions.value);
    console.log(tokenItem);
    ClientAddress.innerHTML = tokenItem.clientAddr;
    UpdateAddressButton.disabled = false;
    if(tokenItem.isAutoRenew){
      renewButton.disabled = true;
      terminateButton.disabled = false;
    } else {
      renewButton.disabled = false;
      terminateButton.disabled = true;
    }
  }


});



renewButton.onclick = async () => {

  const AutoRenewPaymentContract = new ethers.Contract(AutoRenewPaymentAddress, AutoRenewPaymentAbi, signer);

  console.log('Token ID', TicketListOptions.value);
  await AutoRenewPaymentContract.startAutoRenew(TicketListOptions.value);
  renewButton.disabled = true;
  terminateButton.disabled = false;

};

terminateButton.onclick = async () => {

  const AutoRenewPaymentContract = new ethers.Contract(AutoRenewPaymentAddress, AutoRenewPaymentAbi, signer);

  console.log('Token ID', TicketListOptions.value);
  await AutoRenewPaymentContract.terminateAutoRenew(TicketListOptions.value);
  renewButton.disabled = false;
  terminateButton.disabled = true;

};




UpdateAddressButton.onclick = async () => {

  console.log('signer: ' + await signer.getAddress());

  const SubscriptionTicketManagerContract = new ethers.Contract(SubscriptionTicketManagerAddress, SubscriptionTicketManagerAbi, signer);
  console.log(newClientAddressInput.value);
  console.log(TicketListOptions.value);
  await SubscriptionTicketManagerContract.updateClientAddress(TicketListOptions.value, newClientAddressInput.value);


};


async function setupSubscriberStatus() {
  //const SubscriptionPaymentContract = new ethers.Contract(SubscriptionPaymentAddress, SubscriptionPaymentAbi, provider);
  const SubscriptionManagerContract = new ethers.Contract(SubscriptionManagerAddress, SubscriptionManagerAbi, provider);
  const PackagePlanPaymentContract = new ethers.Contract(PackagePlanPaymentAddress, PackagePlanPaymentAbi, provider);
  const SubscriptionTicketManagerContract = new ethers.Contract(SubscriptionTicketManagerAddress, SubscriptionTicketManagerAbi, provider);
  const AutoRenewPaymentContract = new ethers.Contract(AutoRenewPaymentAddress, AutoRenewPaymentAbi, provider);
  let signerAddress = await provider.getSigner().getAddress();
  console.log('Signer Address: ', signerAddress);
  let balance = await SubscriptionTicketManagerContract.balanceOf(signerAddress);
  console.log(balance.toString());
  for (let i=0; i<balance; i++) {
    let tokenId = await SubscriptionTicketManagerContract.tokenOfOwnerByIndex(signerAddress, i);
    let subscriptionInfo = await SubscriptionTicketManagerContract.getSubscriptionInfo(tokenId);
    let clientAddr = await SubscriptionTicketManagerContract.getClientAddress(tokenId);
    let isAutoRenew = await AutoRenewPaymentContract.isAutoRenew(tokenId);
    let tokenItem = {
      tokenId: tokenId,
      productId: subscriptionInfo.productId,
      startDate: subscriptionInfo.startTime,
      endDate: subscriptionInfo.endTime,
      clientAddr: clientAddr,
      isAutoRenew: isAutoRenew
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
    createTd(tokenList[i].isAutoRenew);
    TicketListTable.appendChild(tr);
  }



  for(let i=0; i<tokenList.length; i++){
    let option = document.createElement("option");
    option.text = tokenList[i].tokenId;
    option.value = tokenList[i].tokenId;
    TicketListOptions.appendChild(option);
  }


  dailyFee = parseInt(ethers.utils.formatEther(await PackagePlanPaymentContract.getProductFee(ProductId, 1)));
  weeklyFee = parseInt(ethers.utils.formatEther(await PackagePlanPaymentContract.getProductFee(ProductId, 2)));
  monthlyFee = parseInt(ethers.utils.formatEther(await PackagePlanPaymentContract.getProductFee(ProductId, 3)));
  yearlyFee = parseInt(ethers.utils.formatEther(await PackagePlanPaymentContract.getProductFee(ProductId, 4)));
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
  let accounts = await provider.listAccounts();
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

async function loadPage() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  enableEthereumButton.disabled = true;
  enableEthereumButton.innerHTML = window.ethereum.selectedAddress;
  let isTokenHolder = await tokenHoldCheck();
  if(!isTokenHolder){
    descBox.style.display = "block";
    console.log('user do not hold token');
    document.getElementById('token_address').innerHTML = CurrencyTokenAddress;
  }
  console.log('Loading is done');

}

window.ethereum.on('accountsChanged', async (accounts) => {
  // Handle the new accounts, or lack thereof.
  // "accounts" will always be an array, but it can be empty.
  console.log('account has changed');
  await loadPage();
  await setupSubscriberStatus();
});

window.addEventListener('load', async (event) => {

  provider = new ethers.providers.Web3Provider(window.ethereum);

  let connected = await isMetaMaskConnected();
  if (connected){
    // metamask is connected
    console.log('metamask is connected to ' + window.ethereum.selectedAddress);
    await loadPage();
    await setupSubscriberStatus();

  } else{
    // metamask is not connected
    console.log('metamask is not connected');
    document.getElementById('metamask-announce').style.display = "block";
  }

  console.log('Completed');


});

