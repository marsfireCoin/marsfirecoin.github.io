document.addEventListener("DOMContentLoaded", () => {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: "#1e1e2e",
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    const game = new Phaser.Game(config);
    let balance = 0;
    let balanceText;
    let mineButton;
    let web3;
    let userAccount;
    const MFC_CONTRACT_ADDRESS = "0xYourMFCContractHere";
    const MFC_ABI = [];

    function preload() {
        this.load.image("coin", "assets/images/coin.png");
    }

    function create() {
        balanceText = this.add.text(20, 20, `Balance: ${balance} MFC`, { fontSize: "24px", fill: "#ffffff" });
        mineButton = this.add.image(400, 300, "coin").setInteractive();
        mineButton.setScale(0.5);
        mineButton.on("pointerdown", mineCoins, this);
        setupMetaMask();
    }

    function update() {}

    async function setupMetaMask() {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                userAccount = accounts[0];
            } catch (error) {
                console.error("User denied account access");
            }
        } else {
            alert("MetaMask not detected! Install MetaMask to play.");
        }
    }

    async function mineCoins() {
        const minedAmount = Math.floor(Math.random() * 10) + 1;
        balance += minedAmount;
        balanceText.setText(`Balance: ${balance} MFC`);
        distributeMFC(minedAmount);
    }

    async function distributeMFC(amount) {
        if (!web3 || !userAccount) {
            alert("Please connect your MetaMask wallet!");
            return;
        }
        const contract = new web3.eth.Contract(MFC_ABI, MFC_CONTRACT_ADDRESS);
        contract.methods.transfer(userAccount, web3.utils.toWei(amount.toString(), "ether"))
            .send({ from: userAccount })
            .then(receipt => console.log("MFC Transferred: ", receipt))
            .catch(error => console.error("Error transferring MFC: ", error));
    }
});
