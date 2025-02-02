document.addEventListener("DOMContentLoaded", async function () {
    let questionData = [];
    let timer;
    let timeLeft = 10;
    let streak = 0;
    let score = 0;
    let isBonusRound = false;
    let leaderboard = [];
    let userAddress = null;
    let contract, provider, signer;

    const timerElement = document.querySelector("#timer");
    const questionBox = document.querySelector("#question");
    const feedbackBox = document.querySelector("#feedback");
    const answerInput = document.querySelector("#answer");
    const streakBox = document.querySelector("#streak");
    const scoreBox = document.querySelector("#score");
    const leaderboardElement = document.querySelector("#leaderboard");
    const walletButton = document.querySelector("#connect-wallet");
    const balanceElement = document.querySelector("#balance");

    // MarsFireCoin Contract Details
    const contractAddress = "YOUR_MARSFIRECOIN_CONTRACT_ADDRESS"; 
    const contractABI = [
        // Minimal ABI for sending tokens
        {
            "constant": false,
            "inputs": [
                { "name": "recipient", "type": "address" },
                { "name": "amount", "type": "uint256" }
            ],
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
            walletButton.innerText = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
            updateBalance();
        } else {
            alert("Please install MetaMask!");
        }
    }

    async function updateBalance() {
        if (contract && userAddress) {
            const balance = await contract.balanceOf(userAddress);
            balanceElement.innerText = `Balance: ${ethers.utils.formatUnits(balance, 18)} MFC`;
        }
    }

    async function rewardPlayer(amount) {
        if (contract && userAddress) {
            const tx = await contract.transfer(userAddress, ethers.utils.parseUnits(amount.toString(), 18));
            await tx.wait();
            updateBalance();
        }
    }

    async function loadQuestions() {
        const response = await fetch("questions.json");
        questionData = await response.json();
    }

    function generateQuestion(difficulty) {
        const filteredFacts = questionData.filter(q => q.difficulty === difficulty);
        const fact = filteredFacts[Math.floor(Math.random() * filteredFacts.length)].fact;

        const templates = [
            `What is special about Mars? ${fact}`,
            `True or False: ${fact.replace('Mars', 'The Red Planet')}`,
            `Fill in the blank: ${fact.replace(/\b\w+\b/g, '_____')}`
        ];

        return {
            question: templates[Math.floor(Math.random() * templates.length)],
            answer: fact
        };
    }

    function startTimer() {
        clearInterval(timer);
        timeLeft = isBonusRound ? 5 : 10;
        timerElement.innerText = timeLeft;

        timer = setInterval(() => {
            timeLeft--;
            timerElement.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                feedbackBox.innerText = "⏳ Time's up!";
                streak = 0;
                streakBox.innerText = streak;
            }
        }, 1000);
    }

    function displayQuestion() {
        const difficulty = document.querySelector("#difficulty").value;
        const { question, answer } = generateQuestion(difficulty);
        questionBox.innerText = question;
        questionBox.dataset.answer = answer;

        startTimer();
        playSound("click.mp3");

        if (streak >= 5 && !isBonusRound) {
            isBonusRound = true;
            document.querySelector(".bonus-round").style.display = "block";
        }
    }

    async function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer = questionBox.dataset.answer.toLowerCase();

        if (userAnswer && correctAnswer.includes(userAnswer)) {
            feedbackBox.innerText = "✅ Correct!";
            playSound("correct.mp3");
            streak++;
            score += isBonusRound ? 20 : 10;
            await rewardPlayer(5); // Reward 5 MFC tokens
        } else {
            feedbackBox.innerText = "❌ Wrong!";
            playSound("wrong.mp3");
            streak = 0;
        }

        streakBox.innerText = streak;
        scoreBox.innerText = score;
        answerInput.value = "";

        leaderboard.push({ score, streak });
        leaderboard.sort((a, b) => b.score - a.score);
        updateLeaderboard();

        clearInterval(timer);
        isBonusRound = false;
        document.querySelector(".bonus-round").style.display = "none";
    }

    function playSound(filename) {
        const audio = new Audio(`sounds/${filename}`);
        audio.play();
    }

    function updateLeaderboard() {
        leaderboardElement.innerHTML = leaderboard.slice(0, 5)
            .map(player => `<li>Score: ${player.score} | Streak: ${player.streak}</li>`)
            .join('');
    }

    document.querySelector("#connect-wallet").addEventListener("click", connectWallet);
    await loadQuestions();
    document.querySelector("#new-question").addEventListener("click", displayQuestion);
    document.querySelector("#submit-answer").addEventListener("click", checkAnswer);
});
