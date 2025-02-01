const contractAddress = "YOUR_MFC_CONTRACT_ADDRESS";
const contractABI = [
    // Paste the MarsFireCoin (MFC) contract ABI here
];

let web3;
let account;
let contract;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            account = accounts[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById("wallet-address").innerText = `Connected: ${account}`;
            getBalance();
        } catch (error) {
            console.error("User denied wallet connection", error);
        }
    } else {
        alert("MetaMask not detected. Please install MetaMask to use this feature.");
    }
}

async function getBalance() {
    if (contract && account) {
        const balance = await contract.methods.balanceOf(account).call();
        document.getElementById("mfc-balance").innerText = `MFC Balance: ${web3.utils.fromWei(balance, "ether")} MFC`;
    }
}

async function rewardMFC(amount) {
    if (contract && account) {
        await contract.methods.mint(account, web3.utils.toWei(amount.toString(), "ether")).send({ from: account });
        getBalance();
        alert(`You received ${amount} MFC!`);
    }
}

document.getElementById("connect-wallet").addEventListener("click", connectWallet);
