let playerMFC = 0;
let questProgress = 0;
const totalStages = 5;
const nftPrice = 100;
let web3;
let contract;

const contractAddress = "0x88Baf9A9ce2514A0d0035d7EDED88A4cb9748680"; // Replace with your contract address
const contractABI = [ [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rewardPlayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}] ];

window.onload = function () {
    console.log("Game Loaded");

    // Initialize Web3
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
    } else {
        alert("Please install MetaMask to play the game!");
    }

    document.getElementById("connect-wallet").onclick = connectWallet;
    document.getElementById("start-quest").onclick = startQuest;
    document.getElementById("buy-nft").onclick = buyNFT;

    // Set up contract instance
    contract = new web3.eth.Contract(contractABI, contractAddress);
};

// 🌐 Connect MetaMask
async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Connected account:", accounts[0]);
        document.getElementById("player-info").innerHTML = `Wallet: ${accounts[0]}`;
        document.getElementById("start-quest").disabled = false;
    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert("Wallet connection failed. Try again.");
    }
}

// 🎮 Start Quest
async function startQuest() {
    console.log("Quest started!");
    playerMFC = await getPlayerMFC();  // Fetch current MFC balance
    questProgress = 0;
    document.getElementById("quest-progress").value = 0;
    document.getElementById("quest-status").innerHTML = "🔥 Quest started! Complete challenges.";

    nextChallenge();
}

// ⚔️ Next Challenge
function nextChallenge() {
    if (questProgress < totalStages) {
        setTimeout(() => {
            const success = Math.random() < 0.8;
            if (success) {
                const earnedMFC = Math.floor(Math.random() * 50) + 10;
                playerMFC += earnedMFC;
                questProgress++;

                document.getElementById("character").style.left = `${questProgress * 20}%`;
                document.getElementById("quest-progress").value = questProgress;
                document.getElementById("quest-status").innerHTML = `✅ Stage ${questProgress}/${totalStages} complete! +${earnedMFC} MFC`;

                nextChallenge();
            } else {
                document.getElementById("quest-status").innerHTML = `❌ Stage ${questProgress + 1} failed. Restart!`;
            }
        }, 2000);
    } else {
        finishQuest();
    }
}

// 🏆 Finish Quest
async function finishQuest() {
    console.log("Quest Completed!");
    document.getElementById("quest-status").innerHTML = `🎉 Quest Complete! You earned ${playerMFC} MFC!`;
    document.getElementById("start-quest").disabled = false;

    if (playerMFC >= nftPrice) {
        document.getElementById("buy-nft").disabled = false;
    }
}

// 🎨 Buy NFT
async function buyNFT() {
    if (playerMFC >= nftPrice) {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        // Call contract method to mint NFT or transfer NFT
        try {
            await contract.methods.buyNFT().send({ from: account });
            playerMFC -= nftPrice;
            document.getElementById("quest-status").innerHTML = `🖼️ NFT Purchased! Remaining MFC: ${playerMFC}`;
        } catch (error) {
            console.error("NFT purchase failed:", error);
            alert("NFT purchase failed! Try again.");
        }
    } else {
        alert("Not enough MFC to buy an NFT!");
    }
}

// Fetch Player's MFC balance
async function getPlayerMFC() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const balance = await contract.methods.balanceOf(account).call();
    return web3.utils.fromWei(balance, "ether");  // Assuming MFC uses Ether units
}
