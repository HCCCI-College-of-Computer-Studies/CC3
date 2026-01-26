// ================================================
// CC3: Computer Programming 2 - Interactive Features
// ================================================

// Quiz functionality
function checkAnswer(questionId, correctAnswer) {
    const question = document.getElementById(questionId);
    const options = question.querySelectorAll('.quiz-options label');
    const selected = question.querySelector('input[type="radio"]:checked');
    const feedback = question.querySelector('.feedback');
    
    if (!selected) {
        alert('Please select an answer.');
        return;
    }
    
    const selectedValue = selected.value;
    
    // Reset all options
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });
    
    // Mark correct and incorrect
    options.forEach(option => {
        const input = option.querySelector('input');
        if (input.value === correctAnswer) {
            option.classList.add('correct');
        } else if (input.checked) {
            option.classList.add('incorrect');
        }
    });
    
    // Show feedback
    if (selectedValue === correctAnswer) {
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ Correct! Well done.';
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '✗ Incorrect. The correct answer is highlighted above.';
    }
}

// Predict output functionality
function checkPrediction(inputId, expectedOutput, feedbackId) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(feedbackId);
    const userAnswer = input.value.trim();
    
    if (!userAnswer) {
        alert('Please enter your prediction.');
        return;
    }
    
    // Normalize both answers for comparison
    const normalizedUser = userAnswer.replace(/\s+/g, ' ').trim();
    const normalizedExpected = expectedOutput.replace(/\s+/g, ' ').trim();
    
    if (normalizedUser === normalizedExpected) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '✓ Correct! The output is:<br><code>' + expectedOutput + '</code>';
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '✗ Not quite. The expected output is:<br><code>' + expectedOutput + '</code>';
    }
}

// Show answer functionality
function showAnswer(answerId) {
    const answer = document.getElementById(answerId);
    if (answer.style.display === 'none' || answer.style.display === '') {
        answer.style.display = 'block';
    } else {
        answer.style.display = 'none';
    }
}

// Tab functionality
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove('active');
    }
    
    const tablinks = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Collapsible functionality
document.addEventListener('DOMContentLoaded', function() {
    const collapsibles = document.querySelectorAll('.collapsible-header');
    
    collapsibles.forEach(header => {
        header.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
        });
    });
    
    // Progress bar
    updateProgressBar();
    window.addEventListener('scroll', updateProgressBar);
});

function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar .progress');
    if (progressBar) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    }
}

// Simple code runner simulation (displays expected output)
function runCode(codeAreaId, outputAreaId, expectedOutput) {
    const output = document.getElementById(outputAreaId);
    output.innerHTML = '<span style="color: #888;">Running...</span>';
    
    setTimeout(() => {
        output.innerHTML = expectedOutput;
    }, 500);
}

// Copy code functionality
function copyCode(buttonElement) {
    const codeBlock = buttonElement.closest('.code-example').querySelector('pre');
    const code = codeBlock.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Copied!';
        setTimeout(() => {
            buttonElement.textContent = originalText;
        }, 2000);
    });
}

// Reset quiz
function resetQuiz(questionId) {
    const question = document.getElementById(questionId);
    const options = question.querySelectorAll('.quiz-options label');
    const radios = question.querySelectorAll('input[type="radio"]');
    const feedback = question.querySelector('.feedback');
    
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });
    
    radios.forEach(radio => {
        radio.checked = false;
    });
    
    feedback.className = 'feedback';
    feedback.style.display = 'none';
}

// Knowledge check score
function calculateScore(formId) {
    const form = document.getElementById(formId);
    const questions = form.querySelectorAll('.quiz-question');
    let correct = 0;
    let total = questions.length;
    
    questions.forEach((question, index) => {
        const correctAnswer = question.dataset.correct;
        const selected = question.querySelector('input[type="radio"]:checked');
        
        if (selected && selected.value === correctAnswer) {
            correct++;
        }
    });
    
    const percentage = Math.round((correct / total) * 100);
    const resultDiv = document.getElementById('quiz-result');
    
    if (percentage >= 80) {
        resultDiv.innerHTML = `<div class="feedback correct">Excellent! You scored ${correct}/${total} (${percentage}%). You have a solid understanding of this topic.</div>`;
    } else if (percentage >= 60) {
        resultDiv.innerHTML = `<div class="feedback" style="background: #fefcbf; color: #744210; display: block;">Good effort! You scored ${correct}/${total} (${percentage}%). Review the topics you missed.</div>`;
    } else {
        resultDiv.innerHTML = `<div class="feedback incorrect">You scored ${correct}/${total} (${percentage}%). Consider reviewing this lesson before moving on.</div>`;
    }
}
