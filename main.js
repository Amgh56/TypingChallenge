const quoteApiUrl = "https://baconipsum.com/api/?type=meat-and-filler&sentences=1";
const quoteOutput = document.getElementById("quoteOutput");
const quoteInput = document.getElementById("quoteInput");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
let startTime;
let timerInterval;

// Function to fetch a new random sentence
const getRandomQuote = async () => {
    try {
        const response = await fetch(quoteApiUrl);
        const data = await response.json();
        return data[0]; 
    } catch (error) {
        console.error("Error fetching quote: ", error);
        return "Failed to load a new quote. Please try again later.";
    }
};

// Function to start the typing challenge
const startTypingChallenge = async () => {
    const quote = await getRandomQuote();
    quoteOutput.innerHTML = "";
    quoteInput.value = "";
    quote.split('').forEach(character => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        quoteOutput.appendChild(characterSpan);
    });

    quoteInput.disabled = false;
    quoteInput.focus();

    // Clear any existing interval before starting a new one
    clearInterval(timerInterval);
    startTimer();
    // Reset WPM for new sentence
    wpmElement.innerText = "WPM: 0"; 
};

// Function to calculate WPM dynamically
function calculateWPM() {
   
    const timeElapsedInMinutes = getTimer() / 60;

    if (timeElapsedInMinutes <= 0) {
        wpmElement.innerText = `WPM: 0`;
        return;
    }
    const numberOfCharactersTyped = quoteInput.value.length;

    // Calculate words typed (assuming each word is 5 characters)
    const wordsTyped = numberOfCharactersTyped / 5;

    // Calculate WPM
    const wpm = Math.floor(wordsTyped / timeElapsedInMinutes);
    wpmElement.innerText = `WPM: ${isNaN(wpm) || !isFinite(wpm) ? 0 : wpm}`; // Handle divide by zero or NaN cases
}

// Function to start the timer
function startTimer() {
    startTime = new Date();
    timerElement.innerText = 'Time: 0s';
    timerInterval = setInterval(() => {
        timerElement.innerText = ` ${getTimer()}`;
        calculateWPM(); // Update WPM every second
    }, 1000);
}

// Function to get the current timer value
function getTimer() {
    return Math.floor((new Date() - startTime) / 1000);
}

// Event listener for input field
quoteInput.addEventListener("input", () => {
    const arrayQuote = quoteOutput.querySelectorAll('span');
    const arrayValue = quoteInput.value.split('');
    let correct = true;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character === undefined) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.remove("correct");
            characterSpan.classList.add("incorrect");
            correct = false;
        }
    });

    if (correct) {
        // Alert the user with the current WPM
        alert(`You completed the sentence with a WPM of: ${wpmElement.innerText.split(' ')[1]}`);
        // Start a new challenge typing challenge
        startTypingChallenge(); 
    }
});


window.addEventListener('load', startTypingChallenge);
quoteInput.disabled = true;
