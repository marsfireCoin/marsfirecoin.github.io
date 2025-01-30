let isQuestStarted = false;

document.getElementById('start-quest').onclick = startQuest;
document.getElementById('buy-nft').onclick = buyNFT;

async function startQuest() {
    if (!isQuestStarted) {
        alert("Quest started! Earn MarsFireCoin for completing it.");
        isQuestStarted = true;
        // Simulate earning MarsFireCoin and completing the quest
        await completeQuest();
    }
}

async function completeQuest() {
    const rewardAmount = web3.utils.toWei("10", "ether"); // 10 MarsFireCoin tokens

    try {
        const receipt = await contract.methods
            .rewardPlayer(accounts[0], rewardAmount)
            .send({ from: accounts[0] });
        alert("Quest completed! You earned 10 MarsFireCoin.");
        console.log("Transaction successful: ", receipt);
    } catch (error) {
        console.error("Transaction failed: ", error);
    }
}

async function buyNFT() {
    const nftId = 1; // Example NFT ID to buy
    const price = web3.utils.toWei("0.05", "ether"); // Price of NFT in Ether (could be MarsFireCoin)

    try {
        const receipt = await nftContract.methods
            .buyNFT(nftId)
            .send({ from: accounts[0], value: price });
        alert("NFT purchased successfully!");
        console.log("NFT purchased: ", receipt);
    } catch (error) {
        console.error("NFT purchase failed: ", error);
    }
}
