document.addEventListener("DOMContentLoaded", async function () {
    let score = 0;
    let timeLeft = 15;
    let timer;
    let questionData = [];

    async function loadQuestions() {
        const response = await fetch("questions.json");
        questionData = await response.json();
        displayQuestion();
    }

    function displayQuestion() {
        const difficulty = "medium";  // Can be dynamically set based on user's choice
        const question = questionData.filter(q => q.difficulty === difficulty)[0];
        document.getElementById("question").innerText = question.fact;
        displayOptions(question.correctAnswer);
        resetTimer();
    }

    function displayOptions(correctAnswer) {
        const options = ["Option A", "Option B", "Option C", "Option D"];
        options.forEach(option => {
            const div = document.createElement("div");
            div.classList.add("option");
            div.innerText = option;
            div.addEventListener("click", () => checkAnswer(option, correctAnswer));
            document.getElementById("options").appendChild(div);
        });
    }

    function checkAnswer(selectedOption, correctAnswer) {
        if (selectedOption === correctAnswer) {
            score += 10;
            document.getElementById("feedback").innerText = "✅ Correct!";
        } else {
            document.getElementById("feedback").innerText = "❌ Wrong!";
        }
        document.getElementById("score").innerText = score;
        displayQuestion();  // Load the next question
    }

    function resetTimer() {
        clearInterval(timer);
        timeLeft = 15;
        document.getElementById("timer").innerText = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById("feedback").innerText = "⏳ Time's up!";
            }
        }, 1000);
    }

    document.getElementById("connect-wallet").addEventListener("click", () => {
        // Integrate wallet (MetaMask)
        alert("Wallet connected");
    });

    await loadQuestions();
});
