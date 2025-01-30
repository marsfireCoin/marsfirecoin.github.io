let playerMFC = 0;
let questProgress = 0;
const totalStages = 5;
const nftPrice = 100; // Price in MFC for the NFT

let web3;
let accounts;
let mfcContract;
let nftContract;
const mfcContractAddress = "0x88Baf9A9ce2514A0d0035d7EDED88A4cb9748680"; // MarsFireCoin contract address
const nftContractAddress = "0x27521BCebd3bD3dcAF2F44aDD42B7883Cd91b54b"; // MarsFireNFT contract address
const mfcContractABI = [[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rewardPlayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]];  // Use correct ABI
const nftContractABI = [[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721IncorrectOwner","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721InsufficientApproval","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC721InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"ERC721InvalidOperator","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721InvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC721InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC721InvalidSender","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721NonexistentToken","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"buyNFT","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mintNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]];  // Use correct ABI

window.onload = function () {
    console.log("Game Loaded");

    document.getElementById("connect-wallet").onclick = connectWallet;
    document.getElementById("start-quest").onclick = startQuest;
    document.getElementById("buy-nft").onclick = buyNFT;
};

// 🌐 Connect MetaMask
async function connectWallet() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected account:", accounts[0]);
            document.getElementById("player-info").innerHTML = `Wallet: ${accounts[0]}`;
            document.getElementById("start-quest").disabled = false;

            // Set up contracts
            mfcContract = new web3.eth.Contract(mfcContractABI, mfcContractAddress);
            nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);
        } catch (error) {
            console.error("Wallet connection failed:", error);
            alert("Wallet connection failed. Try again.");
        }
    } else {
        alert("MetaMask not detected! Install MetaMask.");
    }
}

// 🎮 Start Quest
function startQuest() {
    console.log("Quest started!");
    playerMFC = 0;
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

    if (accounts.length > 0) {
        const playerAddress = accounts[0];

        try {
            await mfcContract.methods.rewardPlayer(playerAddress, playerMFC).send({ from: playerAddress });
            console.log(`Minted ${playerMFC} MFC to ${playerAddress}`);
            alert(`🎉 You have earned ${playerMFC} MFC!`);
        } catch (error) {
            console.error("Reward transaction failed:", error);
            alert("Transaction failed. Please check your balance and try again.");
        }
    } else {
        alert("No connected wallet found.");
    }
}

// 🛒 Buy NFT
async function buyNFT() {
    if (!accounts || accounts.length === 0) {
        alert("Connect your wallet first!");
        return;
    }

    const playerAddress = accounts[0];

    try {
        await mfcContract.methods.approve(nftContractAddress, nftPrice).send({ from: playerAddress });
        await nftContract.methods.buyNFT(1).send({ from: playerAddress });

        console.log("NFT purchased successfully!");
        alert("🎉 You bought an NFT!");
    } catch (error) {
        console.error("NFT purchase failed:", error);
        alert("NFT purchase failed. Check your MFC balance and try again.");
    }
}
