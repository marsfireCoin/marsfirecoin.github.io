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

    if (connectButton) connectButton.onclick = connectWallet;
    if (startQuestButton) startQuestButton.onclick = startQuest;
    if (buyNFTButton) {
        buyNFTButton.onclick = buyNFT;
        buyNFTButton.disabled = true; // Disable initially
    }
};

// 🛠️ Connect Wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected account:", accounts[0]);
            document.getElementById("start-quest").disabled = false;
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

    // Ensure the game container exists
    let gameScreen = document.getElementById("game-screen");
    if (!gameScreen) {
        console.error("Element with ID 'game-screen' not found.");
        return;
    }

    playerMFC = 0;
    questProgress = 0;

    gameScreen.innerHTML = `
        <div class="quest-map">
            <div class="character" id="character"></div>
        </div>
        <progress id="quest-progress" value="0" max="${totalStages}"></progress>
        <p id="quest-status">🔥 Quest started! Complete ${totalStages} challenges.</p>
    `;

    nextChallenge();
}

// ⚔️ Next Challenge
function nextChallenge() {
    if (questProgress < totalStages) {
        setTimeout(() => {
            const challengeResult = Math.random() < 0.8; // 80% success rate
            const character = document.getElementById("character");
            const progressBar = document.getElementById("quest-progress");
            const questStatus = document.getElementById("quest-status");

            if (!character || !progressBar || !questStatus) {
                console.error("Game elements missing!");
                return;
            }

            if (challengeResult) {
                const earnedMFC = Math.floor(Math.random() * 50) + 10;
                playerMFC += earnedMFC;
                questProgress++;

                // Update UI
                progressBar.value = questProgress;
                questStatus.innerHTML = `✅ Challenge ${questProgress}/${totalStages} completed! +${earnedMFC} MFC`;
                character.style.left = `${questProgress * 20}%`; // Move character visually

                nextChallenge(); // Continue to next challenge
            } else {
                questStatus.innerHTML = `❌ Challenge ${questProgress + 1} failed. Restart the quest!`;
            }
        }, 2000);
    } else {
        finishQuest();
    }
}

// 🏆 Finish Quest
function finishQuest() {
    console.log("Quest Completed!");
    let questStatus = document.getElementById("quest-status");

    if (questStatus) {
        questStatus.innerHTML = `🎉 Quest Completed! You earned ${playerMFC} MFC!`;
    }

    document.getElementById("start-quest").disabled = false;

    // Enable NFT purchase
    let buyNFTButton = document.getElementById("buy-nft");
    if (buyNFTButton && playerMFC >= nftPrice) {
        buyNFTButton.disabled = false;
    }
}

// 🎨 Buy NFT
function buyNFT() {
    if (playerMFC >= nftPrice) {
        playerMFC -= nftPrice;
        let gameScreen = document.getElementById("game-screen");

        if (gameScreen) {
            gameScreen.innerHTML += `<p>🎨 You bought an NFT! Remaining MFC: ${playerMFC}</p>`;
        }
    } else {
        alert("Not enough MFC to buy an NFT!");
    }
}
