const questions = [
    {
        question: "What is the capital of Japan?",
        answers: [
            { text: "Beijing", correct: false },
            { text: "Seoul", correct: false },
            { text: "Tokyo", correct: true },
            { text: "Bangkok", correct: false }
        ]
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            { text: "Earth", correct: false },
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false }
        ]
    },
    {
        question: "What is 2 + 2?",
        answers: [
            { text: "3", correct: false },
            { text: "4", correct: true },
            { text: "5", correct: false },
            { text: "6", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
const userAnswers = [];


const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const resultElement = document.getElementById('result');

const timeElement = document.getElementById('time');

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 30;
    nextButton.classList.add('hidden');
    resultElement.classList.add('hidden');
    userAnswers.length = 0; // Reset user answers
    startTimer();
    showQuestion(questions[currentQuestionIndex]);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResult();
        }
    }, 1000);
}

function showQuestion(question) {
    questionElement.innerText = question.question + "?"; // Add '?' for animation
    answerButtonsElement.innerHTML = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer, question));
        answerButtonsElement.appendChild(button);
    });
}

function selectAnswer(answer, question) {
    clearInterval(timer);
    const correct = answer.correct;
    userAnswers.push({ question: question.question, correct, userAnswer: answer.text }); // Store user answer
    if (correct) {
        score++;
    } else {
        // Animate wrong answer
        questionElement.classList.add('wrong-answer');
        setTimeout(() => {
            questionElement.classList.remove('wrong-answer');
        }, 1000);
    }

    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        if (button.innerText === answer.text) {
            button.classList.add(correct ? 'correct' : 'incorrect');
        }
    });
    
    if (currentQuestionIndex < questions.length - 1) {
        nextButton.classList.remove('hidden');
    } else {
        showResult();
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion(questions[currentQuestionIndex]);
    nextButton.classList.add('hidden');
    timeLeft = 30; // Reset timer
    timeElement.innerText = timeLeft;
    startTimer();
}

function showResult() {
    clearInterval(timer); // Stop the timer
    questionElement.classList.add('hidden');
    nextButton.classList.add('hidden');
    const percentage = (score / questions.length) * 100;
    
    // Score format
    const scoreMessage = `Score: ${score}/${questions.length}`;

    // Display feedback message
    let feedbackMessage = '';
    if (percentage > 90) {
        feedbackMessage = 'Best!';
    } else if (percentage >= 50) {
        feedbackMessage = 'Good!';
    } else {
        feedbackMessage = 'See next chance.';
    }

    const resultMessage = `${scoreMessage} (${percentage.toFixed(2)}%). ${feedbackMessage}`;
    document.getElementById('score-message').innerText = resultMessage;

    // Display correct and incorrect answers
    const correctAnswers = userAnswers.filter(answer => answer.correct);
    const incorrectAnswers = userAnswers.filter(answer => !answer.correct);
    
    let correctHTML = '<h3>Correct Answers:</h3><ul>';
    correctAnswers.forEach(answer => {
        correctHTML += `<li>${answer.question} - Your answer: ${answer.userAnswer}</li>`;
    });
    correctHTML += '</ul>';
    
    let incorrectHTML = '<h3>Incorrect Answers:</h3><ul>';
    incorrectAnswers.forEach(answer => {
        const correctAnswer = questions.find(q => q.question === answer.question).answers.find(a => a.correct).text;
        incorrectHTML += `<li>${answer.question} - Your answer: ${answer.userAnswer} (Correct: ${correctAnswer})</li>`;
    });
    incorrectHTML += '</ul>';

    resultElement.innerHTML = correctHTML + incorrectHTML;
    resultElement.classList.remove('hidden');
}

startQuiz();
