// game.js

let gameStarted = false;
let playerTokens = 0;
let web3;
let userAccount;

// Web3 Setup
if (typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
} else {
  alert("Please install MetaMask to play the game!");
}

// Function to connect wallet
async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAccount = accounts[0];
      alert('Connected to ' + userAccount);
    } catch (err) {
      alert("Connection failed. Please try again.");
    }
  }
}

// Start the game
function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    document.getElementById("gameStatus").innerText = "Game started! Collect MarsFireCoin tokens!";
    document.querySelector(".game-start-button").disabled = true;
    setupGameBoard();
    connectWallet(); // Connect wallet at the start of the game
  }
}

// Function to set up the game board
function setupGameBoard() {
  let gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = ''; // Clear the board

  // Example of a simple game: Collecting MarsFireCoin tokens
  let tokenButton = document.createElement("button");
  tokenButton.innerText = "Collect MarsFireCoin";
  tokenButton.classList.add("collect-button");
  tokenButton.onclick = collectToken;

  gameBoard.appendChild(tokenButton);
}

// Function to handle token collection
function collectToken() {
  if (!userAccount) {
    alert("Please connect your wallet first!");
    return;
  }
  playerTokens++;
  document.getElementById("gameStatus").innerText = "You collected " + playerTokens + " MarsFireCoin tokens!";
  rewardPlayer(playerTokens);
}

// Function to reward player with MarsFireCoin
async function rewardPlayer(tokens) {
  // Web3 transaction for rewarding tokens (example)
  // This should be integrated with the MarsFireCoin smart contract
  alert(`Rewarding ${tokens} MarsFireCoin tokens to ${userAccount}`);
  
  // Example Web3 call to transfer tokens
  // You can replace this with the actual smart contract interaction
  const tx = {
    from: userAccount,
    to: "0xYourSmartContractAddress", // Replace with MarsFireCoin contract address
    value: web3.utils.toWei("0.1", "ether"), // Example reward (replace with MarsFireCoin value)
  };
  await web3.eth.sendTransaction(tx);
}
