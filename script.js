document.addEventListener("DOMContentLoaded", async function () {
    let questionData = [];
    let timer;
    let timeLeft = 10;
    let streak = 0;
    let score = 0;
    let isBonusRound = false;
    let leaderboard = [];

    const timerElement = document.querySelector("#timer");
    const questionBox = document.querySelector("#question");
    const feedbackBox = document.querySelector("#feedback");
    const answerInput = document.querySelector("#answer");
    const streakBox = document.querySelector("#streak");
    const scoreBox = document.querySelector("#score");
    const leaderboardElement = document.querySelector("#leaderboard");

    // Load Mars facts from JSON
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
        timeLeft = isBonusRound ? 5 : 10; // Faster timer during bonus round
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

        // Start Bonus Round if streak >= 5
        if (streak >= 5 && !isBonusRound) {
            isBonusRound = true;
            document.querySelector(".bonus-round").style.display = "block";
        }
    }

    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer = questionBox.dataset.answer.toLowerCase();

        if (userAnswer && correctAnswer.includes(userAnswer)) {
            feedbackBox.innerText = "✅ Correct!";
            playSound("correct.mp3");
            streak++;
            score += isBonusRound ? 20 : 10; // Extra points during bonus round
        } else {
            feedbackBox.innerText = "❌ Wrong!";
            playSound("wrong.mp3");
            streak = 0;
        }

        streakBox.innerText = streak;
        scoreBox.innerText = score;
        answerInput.value = "";

        // Add to leaderboard
        leaderboard.push({ score, streak });
        leaderboard.sort((a, b) => b.score - a.score); // Sort by score
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

    await loadQuestions();
    document.querySelector("#new-question").addEventListener("click", displayQuestion);
    document.querySelector("#submit-answer").addEventListener("click", checkAnswer);
});
