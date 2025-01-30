window.onload = function () {
    console.log("Game script loaded");

    const connectButton = document.getElementById("connect-wallet");
    if (connectButton) {
        connectButton.onclick = function () {
            console.log("Connect Wallet Clicked");
            connectWallet(); // Call your Web3 wallet connection function
        };
    } else {
        console.error("Connect Wallet button not found!");
    }

    const startQuestButton = document.getElementById("start-quest");
    if (startQuestButton) {
        startQuestButton.onclick = function () {
            console.log("Starting the quest...");
            startQuest();
        };
    } else {
        console.error("Start Quest button not found!");
    }

    const buyNFTButton = document.getElementById("buy-nft");
    if (buyNFTButton) {
        buyNFTButton.onclick = function () {
            console.log("Buying NFT...");
            buyNFT();
        };
    } else {
        console.error("Buy NFT button not found!");
    }
};

// Example Web3 function for connecting a wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected account:", accounts[0]);

            // Enable the Start Quest button after wallet connection
            document.getElementById("start-quest").disabled = false;
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("MetaMask not detected. Please install MetaMask.");
    }
}

function startQuest() {
    console.log("Quest started!");
    document.getElementById("game").innerHTML = "🔥 Quest in progress... Earn MarsFireCoin!";
}

function buyNFT() {
    console.log("NFT purchase initiated!");
}
