let playerMFC = 0;
let questProgress = 0;
const totalStages = 5;
const nftPrice = 100;

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
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected account:", accounts[0]);
            document.getElementById("player-info").innerHTML = `Wallet: ${accounts[0]}`;
            document.getElementById("start-quest").disabled = false;
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
function finishQuest() {
    console.log("Quest Completed!");
    document.getElementById("quest-status").innerHTML = `🎉 Quest Complete! You earned ${playerMFC} MFC!`;
    document.getElementById("start-quest").disabled = false;

    if (playerMFC >= nftPrice) {
        document.getElementById("buy-nft").disabled = false;
    }
}

// 🎨 Buy NFT
function buyNFT() {
    if (playerMFC >= nftPrice) {
        playerMFC -= nftPrice;
        alert(`🎨 NFT Purchased! Remaining MFC: ${playerMFC}`);
        document.getElementById("quest-status").innerHTML = `🖼️ You own an NFT! Remaining MFC: ${playerMFC}`;
    } else {
        alert("Not enough MFC to buy an NFT!");
    }
}
