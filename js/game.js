let playerMFC = 0; // Track earned MarsFireCoin
let questProgress = 0;
const totalStages = 5; // Number of quest challenges
const nftPrice = 100; // NFT price in MFC

window.onload = function () {
    console.log("Game script loaded");

    // Get UI elements
    const connectButton = document.getElementById("connect-wallet");
    const startQuestButton = document.getElementById("start-quest");
    const buyNFTButton = document.getElementById("buy-nft");

    // Ensure elements exist before adding event listeners
    if (connectButton) {
        connectButton.onclick = connectWallet;
    } else {
        console.error("Connect Wallet button not found!");
    }

    if (startQuestButton) {
        startQuestButton.onclick = startQuest;
    } else {
        console.error("Start Quest button not found!");
    }

    if (buyNFTButton) {
        buyNFTButton.onclick = buyNFT;
        buyNFTButton.disabled = true; // Disable initially
    } else {
        console.error("Buy NFT button not found!");
    }
};

// 🛠️ Connect Wallet Function
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected account:", accounts[0]);

            document.getElementById("start-quest").disabled = false; // Enable Quest Button
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("MetaMask not detected. Please install MetaMask.");
    }
}

// 🎮 Start Quest
function startQuest() {
    console.log("Quest started!");
    document.getElementById("game").innerHTML = `<p>🔥 Quest started! Complete ${totalStages} challenges.</p>`;
    questProgress = 0;
    playerMFC = 0; // Reset earnings
    nextChallenge();
}

// ⚔️ Quest Challenges
function nextChallenge() {
    if (questProgress < totalStages) {
        setTimeout(() => {
            const challengeResult = Math.random() < 0.8; // 80% success rate
            const gameDiv = document.getElementById("game");

            if (challengeResult) {
                const earnedMFC = Math.floor(Math.random() * 50) + 10; // Earn 10-50 MFC
                playerMFC += earnedMFC;
                questProgress++;

                // Append challenge progress instead of replacing the entire text
                gameDiv.innerHTML += `<p>✅ Challenge ${questProgress}/${totalStages} completed! +${earnedMFC} MFC</p>`;

                nextChallenge(); // Move to the next stage
            } else {
                gameDiv.innerHTML += `<p>❌ You failed Challenge ${questProgress + 1}. Click "Start Quest" to retry.</p>`;
            }
        }, 2000);
    } else {
        finishQuest();
    }
}

// 🏆 Finish Quest
function finishQuest() {
    console.log("Quest Completed!");
    const gameDiv = document.getElementById("game");
    gameDiv.innerHTML += `<p>🎉 Quest Completed! You earned ${playerMFC} MFC!</p>`;
    document.getElementById("start-quest").disabled = false; // Allow replay

    // Enable "Buy NFT" if enough MFC is earned
    if (playerMFC >= nftPrice) {
        document.getElementById("buy-nft").disabled = false;
    }
}

// 🎨 Buy NFT with MFC
function buyNFT() {
    if (playerMFC >= nftPrice) {
        playerMFC -= nftPrice;
        document.getElementById("game").innerHTML += `<p>🎨 You bought an NFT! Remaining MFC: ${playerMFC}</p>`;
        console.log("NFT Purchased!");
    } else {
        alert("Not enough MFC to buy an NFT!");
    }
}
