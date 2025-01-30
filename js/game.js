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
const mfcContractABI = [ [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rewardPlayer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}] ];
const nftContractABI = [ [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721IncorrectOwner","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721InsufficientApproval","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC721InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"ERC721InvalidOperator","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721InvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC721InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC721InvalidSender","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721NonexistentToken","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"buyNFT","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mintNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}] ];


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
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
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

                // Mint MFC to player's wallet
                mintMFC(earnedMFC);

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
function finishQuest() {
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
        try {
            const accounts = await web3.eth.getAccounts();
            const player = accounts[0];

            // First, deduct MFC from the player's balance (minting logic to deduct MFC)
            await mintMFC(-nftPrice);

            // Now mint the NFT to the player's wallet
            await nftContract.methods.mintNFT(player).send({ from: player });

            playerMFC -= nftPrice;
            alert(`🎨 NFT Purchased! Remaining MFC: ${playerMFC}`);
            document.getElementById("quest-status").innerHTML = `🖼️ You own an NFT! Remaining MFC: ${playerMFC}`;
        } catch (error) {
            console.error("Error purchasing NFT:", error);
            alert("Error purchasing NFT. Try again.");
        }
    } else {
        alert("Not enough MFC to buy an NFT!");
    }
}

// 🪙 Mint MFC to Player's Wallet
async function mintMFC(amount) {
    try {
        const accounts = await web3.eth.getAccounts();
        const player = accounts[0];
        if (amount < 0) {
            amount = Math.abs(amount); // Deduct MFC if buying NFT
            await mfcContract.methods.rewardPlayer(player, -amount).send({ from: player });
        } else {
            const tx = await mfcContract.methods.rewardPlayer(player, amount).send({ from: player });
            console.log("MFC Minted to Player:", tx);
        }
    } catch (error) {
        console.error("Error minting MFC:", error);
    }
}
