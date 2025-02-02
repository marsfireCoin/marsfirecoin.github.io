document.addEventListener("DOMContentLoaded", async function () {
    let questionData = [];
    let timer;
    let timeLeft = 10;
    let streak = 0;
    let score = 0;
    let isBonusRound = false;
    let leaderboard = [];
    let userAddress = null;
    let provider, signer, contract;

    const contractAddress = "YOUR_MARSFIRECOIN_CONTRACT_ADDRESS"; 
    const contractABI = [
        {
            "constant": false,
            "inputs": [{ "name": "recipient", "type": "address" }, { "name": "amount", "type": "uint256" }],
            "name": "transfer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{ "name": "owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    async function connectWallet() {
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            document.querySelector("#connect-wallet").innerText = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
            updateBalance();
        } else {
            alert("Please install MetaMask!");
        }
    }

    async function updateBalance() {
        if (contract && userAddress) {
            const balance = await contract.balanceOf(userAddress);
            document.querySelector("#balance").innerText = `Balance: ${ethers.utils.formatUnits(balance, 18)} MFC`;
        }
    }

    async function loadQuestions() {
        const response = await fetch("questions.json");
        questionData = await response.json();
    }

    function generateQuestion(difficulty) {
        const filteredFacts = questionData.filter(q => q.difficulty === difficulty);
        const fact = filteredFacts[Math.floor(Math.random() * filteredFacts.length)].fact;
        return { question: fact, answer: fact };
    }

    function displayQuestion() {
        const difficulty = document.querySelector("#difficulty").value;
        const { question, answer } = generateQuestion(difficulty);
        document.querySelector("#question").innerText = question;
        document.querySelector("#question").dataset.answer = answer;
    }

    async function checkAnswer() {
        const userAnswer = document.querySelector("#answer").value.trim().toLowerCase();
        const correctAnswer = document.querySelector("#question").dataset.answer.toLowerCase();
        document.querySelector("#feedback").innerText = userAnswer === correctAnswer ? "✅ Correct!" : "❌ Wrong!";
    }

    document.querySelector("#connect-wallet").addEventListener("click", connectWallet);
    document.querySelector("#new-question").addEventListener("click", displayQuestion);
    document.querySelector("#submit-answer").addEventListener("click", checkAnswer);
    await loadQuestions();
});
