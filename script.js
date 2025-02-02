document.addEventListener("DOMContentLoaded", async function () {
    let questionData = [];
    let timeLeft = 10;
    let streak = 0;
    let score = 0;
    let isBonusRound = false;
    let timer;
    let userAddress = null;
    let provider, signer, contract;

    const contractAddress = "YOUR_MARSFIRECOIN_CONTRACT_ADDRESS"; 
    const contractABI = [
        {
            "constant": true,
            "inputs": [{ "name": "owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const correctSound = new Audio("correct.mp3");
    const incorrectSound = new Audio("incorrect.mp3");
    const clickSound = new Audio("click.mp3");

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
        displayQuestion();
    }

    function generateQuestion(difficulty) {
        const filteredFacts = questionData.filter(q => q.difficulty === difficulty);
        const fact = filteredFacts[Math.floor(Math.random() * filteredFacts.length)];
        return { question: fact.fact, answer: fact.fact };
    }

    function displayQuestion() {
        const difficulty = document.querySelector("#difficulty").value;
        const { question, answer } = generateQuestion(difficulty);
        document.querySelector("#question").innerText = question;
        document.querySelector("#question").dataset.answer = answer;
        resetTimer();
    }

    function resetTimer() {
        clearInterval(timer);
        timeLeft = 10;
        document.querySelector("#timer").innerText = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            document.querySelector("#timer").innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.querySelector("#feedback").innerText = "⏳ Time's up!";
                document.querySelector("#feedback").style.color = "yellow";
                incorrectSound.play();
                setTimeout(displayQuestion, 2000);
            }
        }, 1000);
    }

    function checkAnswer() {
        const userAnswer = document.querySelector("#answer").value.trim().toLowerCase();
        const correctAnswer = document.querySelector("#question").dataset.answer.toLowerCase();
        clickSound.play();

        if (userAnswer === correctAnswer) {
            document.querySelector("#feedback").innerText = "✅ Correct!";
            document.querySelector("#feedback").style.color = "lime";
            correctSound.play();
            streak++;
            score += 10;
            if (streak >= 3) {
                isBonusRound = true;
                document.querySelector(".bonus-round").style.display = "block";
                score += 5;
            }
        } else {
            document.querySelector("#feedback").innerText = "❌ Wrong!";
            document.querySelector("#feedback").style.color = "red";
            incorrectSound.play();
            streak = 0;
            isBonusRound = false;
            document.querySelector(".bonus-round").style.display = "none";
        }

        document.querySelector("#streak").innerText = streak;
        document.querySelector("#score").innerText = score;

        setTimeout(() => {
            document.querySelector("#answer").value = "";
            displayQuestion();
        }, 2000);
    }

    document.querySelector("#connect-wallet").addEventListener("click", connectWallet);
    document.querySelector("#new-question").addEventListener("click", () => {
        clickSound.play();
        displayQuestion();
    });
    document.querySelector("#submit-answer").addEventListener("click", checkAnswer);

    await loadQuestions();
});
