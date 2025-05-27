document.addEventListener('DOMContentLoaded', () => {

    // --- Quiz Questions ---
    const questions = [
        {
            text: "What is the MAIN human activity causing today's climate change?",
            options: ["Farming", "Burning Fossil Fuels", "Deforestation", "Using Too Much Water"],
            answer: 1 // Index of the correct option
        },
        {
            text: "Which of these is a major EFFECT of climate change in cities like Accra?",
            options: ["More Sunshine", "Less Wind", "More Flooding", "Colder Winters"],
            answer: 2
        },
        {
            text: "What serious problem along Ghana's coast is made worse by climate change?",
            options: ["More Fish", "Rising Sea Levels", "Cleaner Beaches", "More Tourists"],
            answer: 1
        },
        {
            text: "Cutting down trees (deforestation) in Ghana is often linked to:",
            options: ["Building Roads", "Galamsey (Mining)", "Fishing", "Planting Flowers"],
            answer: 1
        },
        {
            text: "What is a 'clean energy' source we can use more of in Ghana?",
            options: ["Charcoal", "Kerosene", "Diesel Generators", "Solar Panels"],
            answer: 3
        },
        {
            text: "What can YOU do to help manage waste?",
            options: ["Burn Everything", "Throw it in the Gutter", "Reuse and Recycle", "Ignore It"],
            answer: 2
        }
    ];

    // --- DOM Elements ---
    const quizWrapper = document.getElementById('quizWrapper');
    const startScreen = document.getElementById('startScreen');
    const quizScreen = document.getElementById('quizScreen');
    const endScreen = document.getElementById('endScreen');
    const leaderboardScreen = document.getElementById('leaderboardScreen');

    const startButton = document.getElementById('startButton');
    const viewLeaderboardButtonStart = document.getElementById('viewLeaderboardButtonStart');
    const nextButton = document.getElementById('nextButton');
    const saveScoreButton = document.getElementById('saveScoreButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const backButton = document.getElementById('backButton');

    const questionNumberEl = document.getElementById('questionNumber');
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const scoreEl = document.getElementById('score');
    const progressEl = document.getElementById('progress');
    const questionTextEl = document.getElementById('questionText');
    const optionsGrid = document.getElementById('optionsGrid');
    const feedbackEl = document.getElementById('feedback');

    const finalScoreEl = document.getElementById('finalScore');
    const climateRankEl = document.getElementById('climateRank');
    const playerNameInput = document.getElementById('playerName');

    const leaderboardListEl = document.getElementById('leaderboardList');

    // --- Quiz State ---
    let currentQuestionIndex = 0;
    let score = 0;
    let answerSelected = false;

    // --- Functions ---

    function showScreen(screenToShow) {
        document.querySelectorAll('.quizscreen').forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');
    }

    function startGame() {
        currentQuestionIndex = 0;
        score = 0;
        scoreEl.textContent = score;
        showQuestion(currentQuestionIndex);
        showScreen(quizScreen);
    }

    function showQuestion(index) {
        answerSelected = false;
        const question = questions[index];
        questionTextEl.textContent = question.text;
        optionsGrid.innerHTML = ''; // Clear previous options
        feedbackEl.textContent = '';
        nextButton.style.display = 'none';

        question.options.forEach((option, i) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('optionbtn');
            button.addEventListener('click', () => selectAnswer(i, question.answer));
            optionsGrid.appendChild(button);
        });

        questionNumberEl.textContent = index + 1;
        totalQuestionsEl.textContent = questions.length;
        updateProgress();
    }

    function selectAnswer(selectedIndex, correctIndex) {
        if (answerSelected) return; // Prevent multiple clicks
        answerSelected = true;

        const allButtons = optionsGrid.querySelectorAll('.optionbtn');
        allButtons.forEach(btn => btn.classList.add('disabled')); // Disable all buttons

        if (selectedIndex === correctIndex) {
            score += 10;
            scoreEl.textContent = score;
            feedbackEl.textContent = "Correct! Nice One! ✅";
            feedbackEl.style.color = 'var(--correct-green)';
            allButtons[selectedIndex].classList.add('correct');
        } else {
            feedbackEl.textContent = "Oops! Not quite. ❌";
            feedbackEl.style.color = 'var(--incorrect-red)';
            allButtons[selectedIndex].classList.add('incorrect');
            allButtons[correctIndex].classList.add('correct'); // Show correct answer
        }

        nextButton.style.display = 'inline-block';
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
        } else {
            showEndScreen();
        }
    }

    function updateProgress() {
        const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressEl.style.width = `${progressPercent}%`;
    }

    function showEndScreen() {
        finalScoreEl.textContent = score;
        let rank = '🌱 Sprout';
        if (score >= questions.length * 10 * 0.9) {
            rank = '🌳 Baobab Legend!';
        } else if (score >= questions.length * 10 * 0.7) {
            rank = '🌿 Green Guru!';
        } else if (score >= questions.length * 10 * 0.5) {
            rank = '💡 Sapling Star!';
        }
        climateRankEl.textContent = rank;
        playerNameInput.value = ''; // Clear input
        showScreen(endScreen);
    }

    function getLeaderboard() {
        return JSON.parse(localStorage.getItem('greenVibeLeaderboard')) || [];
    }

    function saveLeaderboard(board) {
        localStorage.setItem('greenVibeLeaderboard', JSON.stringify(board));
    }

    function addToLeaderboard() {
        const name = playerNameInput.value.trim();
        if (!name) {
            alert("Please enter a name!");
            return;
        }

        const newEntry = { name: name, score: score };
        const board = getLeaderboard();
        board.push(newEntry);
        board.sort((a, b) => b.score - a.score); // Sort highest first
        const topScores = board.slice(0, 5); // Keep only top 5
        saveLeaderboard(topScores);
        showLeaderboard();
    }

    function showLeaderboard() {
        const board = getLeaderboard();
        leaderboardListEl.innerHTML = ''; // Clear list

        if (board.length === 0) {
            leaderboardListEl.innerHTML = '<li><span>Be the first champ!</span> <span>--</span></li>';
        } else {
            board.forEach((entry, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${index + 1}. ${entry.name}</span> <span>${entry.score}</span>`;
                leaderboardListEl.appendChild(li);
            });
        }
        showScreen(leaderboardScreen);
    }


    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    nextButton.addEventListener('click', nextQuestion);
    playAgainButton.addEventListener('click', startGame);
    saveScoreButton.addEventListener('click', addToLeaderboard);
    viewLeaderboardButtonStart.addEventListener('click', showLeaderboard);
    backButton.addEventListener('click', () => {
        // Decide where to go back (start or end) - let's go to start
        showScreen(startScreen);
    });

    // --- Initial Call ---
    showScreen(startScreen); // Show start screen on load

}); // End DOMContentLoaded