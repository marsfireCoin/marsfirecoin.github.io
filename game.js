document.addEventListener("DOMContentLoaded", async function () {
    const contractAddress = "YOUR_CONTRACT_ADDRESS";
    const abi = [
        { "constant": false, "inputs": [{"name": "player", "type": "address"}, {"name": "amount", "type": "uint256"}], "name": "rewardPlayer", "outputs": [], "type": "function" }
    ];

    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
        alert("Please install MetaMask to play the game!");
    }

    const web3 = window.web3;
    const contract = new web3.eth.Contract(abi, contractAddress);
    const account = (await web3.eth.getAccounts())[0];

    async function fetchQuestion() {
        const response = await fetch("https://api.example.com/mars-questions");
        const data = await response.json();
        return data;
    }

    async function loadQuestion() {
        const questionData = await fetchQuestion();
        const app = document.getElementById("app");
        app.innerHTML = `<h2>${questionData.question}</h2>`;
        questionData.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.onclick = () => handleAnswer(index, questionData.correctIndex);
            app.appendChild(button);
        });
    }

    async function handleAnswer(selected, correct) {
        if (selected === correct) {
            alert("Correct! You've earned MFC tokens.");
            await contract.methods.rewardPlayer(account, web3.utils.toWei("1", "ether")).send({ from: account });
        } else {
            alert("Wrong answer! Try again.");
        }
        loadQuestion();
    }

    loadQuestion();
});