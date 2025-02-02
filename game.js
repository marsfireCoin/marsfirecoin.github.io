document.addEventListener("DOMContentLoaded", function () {
    const contractAddress = "0x3AcDA392212927f9F7f71421355Ae5040eDC0d94";
    const abi = [
        { "constant": false, "inputs": [{"name": "player", "type": "address"}, {"name": "amount", "type": "uint256"}], "name": "rewardPlayer", "outputs": [], "type": "function" }
    ];

    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
        alert("Please install MetaMask to play the game!");
    }

    const web3 = window.web3;
    const contract = new web3.eth.Contract(abi, contractAddress);

    const questions = [
        { question: "What is the largest volcano on Mars?", options: ["Olympus Mons", "Mount Everest", "Vesuvius", "Tharsis Tholus"], correctIndex: 0 },
        { question: "What is the main component of Mars' atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctIndex: 2 },
        { question: "What gives Mars its red color?", options: ["Iron Oxide", "Copper", "Sulfur", "Nickel"], correctIndex: 0 },
        { question: "Which rover first confirmed past water on Mars?", options: ["Curiosity", "Spirit", "Opportunity", "Perseverance"], correctIndex: 1 },
        { question: "How long is a day on Mars?", options: ["24 hours", "25 hours", "26 hours", "23 hours"], correctIndex: 1 }
    ];

    for (let i = 6; i <= 100; i++) {
        questions.push({
            question: `Mars Question ${i}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctIndex: Math.floor(Math.random() * 4)
        });
    }

    let currentQuestion = 0;

    function loadQuestion() {
        const questionBox = document.getElementById("question");
        const optionsBox = document.getElementById("options");
        questionBox.textContent = questions[currentQuestion].question;
        optionsBox.innerHTML = "";
        questions[currentQuestion].options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.onclick = () => handleAnswer(index);
            optionsBox.appendChild(button);
        });
    }

    async function handleAnswer(selected) {
        if (selected === questions[currentQuestion].correctIndex) {
            alert("Correct! You've earned MFC tokens.");
            const accounts = await web3.eth.getAccounts();
            await contract.methods.rewardPlayer(accounts[0], web3.utils.toWei("1", "ether")).send({ from: accounts[0] });
        } else {
            alert("Wrong answer! Try again.");
        }
        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            document.getElementById("game-container").innerHTML = `<h2>Game Over! Thanks for playing.</h2>`;
        }
    }

    loadQuestion();
});