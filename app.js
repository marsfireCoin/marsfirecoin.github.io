let web3;
let mfcContract;
let fomoContract;

// Update with your contract addresses
const MFC_ADDRESS = '0xYOUR_MFC_CONTRACT_ADDRESS';
const FOMO_ADDRESS = '0xYOUR_FOMO_CONTRACT_ADDRESS';

const MFC_ABI = [/* Paste ABI from Remix */];
const FOMO_ABI = [/* Paste ABI from Remix */];

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            document.getElementById('walletAddress').innerText = accounts[0];
            updateBalance();
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function claimFreeMFC() {
    const accounts = await web3.eth.getAccounts();
    mfcContract.methods.claimFreeMFC().send({ from: accounts[0] })
        .on('receipt', () => {
            alert("Successfully claimed 0.1 MFC!");
            updateBalance();
        });
}

async function enterBattle() {
    const accounts = await web3.eth.getAccounts();
    const amount = web3.utils.toWei('0.1', 'ether');
    
    mfcContract.methods.approve(FOMO_ADDRESS, amount).send({ from: accounts[0] })
        .then(() => {
            fomoContract.methods.enterBattle(0, amount).send({ from: accounts[0] })
                .on('receipt', () => alert("Joined battle!"));
        });
}

function updateBalance() {
    const accounts = web3.eth.getAccounts();
    mfcContract.methods.balanceOf(accounts[0]).call()
        .then(balance => {
            document.getElementById('mfcBalance').innerText = 
                web3.utils.fromWei(balance, 'ether');
        });
}

// Initialize contracts
window.onload = async () => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        mfcContract = new web3.eth.Contract(MFC_ABI, MFC_ADDRESS);
        fomoContract = new web3.eth.Contract(FOMO_ABI, FOMO_ADDRESS);
    }
};