let web3;
let userAccount;
let marsFireCoinContract;

const stakeButton = document.getElementById("stake-button");
const stakeAmountInput = document.getElementById("stake-amount");
const timerElement = document.getElementById("timer");
const totalPoolElement = document.getElementById("total-pool");
const yourShareElement = document.getElementById("your-share");
const socialButton = document.getElementById("share-twitter");

const updateTimer = () => {
  let timeLeft = 24 * 60 * 60; // 24 hours in seconds
  setInterval(() => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timerElement.innerText = `${hours}:${minutes}:${seconds}`;
    timeLeft--;
  }, 1000);
};

const connectWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    console.log(`Connected: ${userAccount}`);
  } else {
    alert("Please install MetaMask to play MarsFOMO!");
  }
};

const stakeTokens = async () => {
  const stakeAmount = stakeAmountInput.value;
  if (!stakeAmount || isNaN(stakeAmount) || stakeAmount <= 0) {
    alert("Please enter a valid stake amount.");
    return;
  }

  // Here we'll call the staking smart contract to stake the tokens
  try {
    await marsFireCoinContract.methods.stakeTokens(stakeAmount).send({ from: userAccount });
    alert(`Successfully staked ${stakeAmount} MarsFireCoin`);
  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  }
};

const shareOnTwitter = () => {
  window.open('https://twitter.com/intent/tweet?text=Join+MarsFOMO%21+Predict+the+hyped+tokens+and+earn+MarsFireCoin', '_blank');
};

// Initialize app
window.addEventListener("load", async () => {
  connectWeb3();
  updateTimer();
  stakeButton.addEventListener("click", stakeTokens);
  socialButton.addEventListener("click", shareOnTwitter);
});
