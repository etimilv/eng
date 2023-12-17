document.addEventListener('DOMContentLoaded', () => {
    let wordPairs = [];
    let currentWordIndex = 0;

    const wordInputContainer = document.getElementById('wordInputContainer');
    const wordPairsContainer = document.getElementById('wordPairs');
    const addWordPairButton = document.getElementById('addWordPair');
    const startTestButton = document.getElementById('startTest');
    const mainContainer = document.getElementById('mainContainer');
    const wordDisplay = document.getElementById('wordDisplay');
    const userInput = document.getElementById('userInput');
    const submitButton = document.getElementById('submitAnswer');
    const feedback = document.getElementById('feedback');
    const hintDisplay = document.getElementById('hint');
    const summaryDisplay = document.getElementById('summary');
    
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission
            checkAnswer();
        }
    });

    addWordPairButton.addEventListener('click', () => {
        let newPairContainer = document.createElement('div');
        newPairContainer.className = 'word-pair-container';

        let newSwedishInput = document.createElement('input');
        newSwedishInput.type = 'text';
        newSwedishInput.placeholder = 'Swedish word';
        newSwedishInput.className = 'swedish-input';

        let newEnglishInput = document.createElement('input');
        newEnglishInput.type = 'text';
        newEnglishInput.placeholder = 'English translation';
        newEnglishInput.className = 'english-input';

        newPairContainer.appendChild(newSwedishInput);
        newPairContainer.appendChild(newEnglishInput);
        wordPairsContainer.appendChild(newPairContainer);
    });

    startTestButton.addEventListener('click', () => {
        const swedishInputs = document.querySelectorAll('.swedish-input');
        const englishInputs = document.querySelectorAll('.english-input');
        wordPairs = [];

        swedishInputs.forEach((input, index) => {
            if (input.value && englishInputs[index].value) {
                wordPairs.push({
                    swedish: input.value,
                    english: englishInputs[index].value,
                    attempts: 0,
                    correct: 0,
                    incorrect: 0
                });
            }
        });

        if (wordPairs.length > 0) {
            wordInputContainer.style.display = 'none';
            mainContainer.style.display = 'block';
            currentWordIndex = 0;
            displayWord();
        } else {
            alert('Please enter at least one word pair before starting the test.');
        }
    });

    function displayWord() {
        if (currentWordIndex < wordPairs.length) {
            wordDisplay.textContent = wordPairs[currentWordIndex].swedish;
            userInput.value = '';
            feedback.textContent = '';
            hintDisplay.innerHTML = '';
            userInput.focus();
        } else {
            displaySummary();
        }
    }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displaySummary() {
        mainContainer.innerHTML = '<h2>Summary</h2>';

        wordPairs.forEach(pair => {
            let summaryText = `${pair.swedish} - ${pair.english}: ${pair.attempts} attempts, ${pair.incorrect} incorrect`;
            let para = document.createElement('p');
            para.textContent = summaryText;
            mainContainer.appendChild(para);
        });

        // Retake Test button
        let retakeTestButton = document.createElement('button');
        retakeTestButton.textContent = 'Retake Test';
        retakeTestButton.addEventListener('click', retakeTest);
        mainContainer.appendChild(retakeTestButton);
    }

    function startTest() {
        shuffleArray(wordPairs); // Shuffle the word pairs
        currentWordIndex = 0; // Reset the index for the test
    
        mainContainer.innerHTML = ''; // Clear main container
        mainContainer.appendChild(wordDisplay);
        mainContainer.appendChild(userInput);
        mainContainer.appendChild(submitButton);
        mainContainer.appendChild(feedback);
        mainContainer.appendChild(hintDisplay);
    
        wordInputContainer.style.display = 'none';
        mainContainer.style.display = 'block';
        displayWord();
    }
    
    function retakeTest() {
        wordPairs.forEach(pair => {
            pair.attempts = 0;
            pair.correct = 0;
            pair.incorrect = 0;
        });
        shuffleArray(wordPairs); // Shuffle the word pairs again for the retake
        currentWordIndex = 0;
    
        mainContainer.innerHTML = ''; // Clear and reset the main container
        mainContainer.appendChild(wordDisplay);
        mainContainer.appendChild(userInput);
        mainContainer.appendChild(submitButton);
        mainContainer.appendChild(feedback);
        mainContainer.appendChild(hintDisplay);
    
        mainContainer.style.display = 'block';
        displayWord();
    }

    function checkAnswer() {
        let currentPair = wordPairs[currentWordIndex];
        let userAnswer = userInput.value.trim().toLowerCase();
        currentPair.attempts++;

        if (userAnswer === currentPair.english) {
            currentPair.correct++;
            feedback.textContent = 'Correct!';
            feedback.style.color = 'green';
            currentWordIndex++;
            setTimeout(displayWord, 1000);
        } else {
            currentPair.incorrect++;
            feedback.textContent = 'Incorrect, try again.';
            feedback.style.color = 'red';
            provideHint();
        }
    }

    function provideHint() {
        // Clear previous hints
        hintDisplay.innerHTML = '';
        let currentPair = wordPairs[currentWordIndex];
        let hints = [];
        hints.push(`Hint: The word has ${currentPair.english.length} letters.`);
        hints.push(`Hint: It starts with '${currentPair.english.charAt(0)}'.`);
        hints.push(`Hint: It ends with '${currentPair.english.charAt(currentPair.english.length - 1)}'.`);

        // Show all hints up to the current number of incorrect attempts
        for (let i = 0; i < currentPair.incorrect && i < hints.length; i++) {
            let hintPara = document.createElement('p');
            hintPara.textContent = hints[i];
            hintDisplay.appendChild(hintPara);
        }
    }

    submitButton.addEventListener('click', checkAnswer);
});
