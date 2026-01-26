/**
 * Interactive Quiz System - W3Schools Style
 * CC3 Learning Platform
 */

// Quiz Questions Database
const quizData = {
    basics: [
        {
            question: "Which of the following is the correct way to declare a variable in Java?",
            options: ["variable x = 5;", "int x = 5;", "x = 5 int;", "declare x = 5;"],
            correct: 1,
            difficulty: "easy",
            explanation: "In Java, you must specify the data type before the variable name. 'int x = 5;' declares an integer variable named x with value 5."
        },
        {
            question: "What is the output of: System.out.println(10 + 20 + \"Hello\");",
            options: ["1020Hello", "30Hello", "10 + 20 + Hello", "Error"],
            correct: 1,
            difficulty: "medium",
            explanation: "Java evaluates left to right. First 10 + 20 = 30, then 30 is concatenated with \"Hello\" resulting in \"30Hello\"."
        },
        {
            question: "Which data type is used to store a single character?",
            options: ["String", "char", "Character", "letter"],
            correct: 1,
            difficulty: "easy",
            explanation: "The 'char' data type is used to store a single character in Java, enclosed in single quotes like 'A'."
        },
        {
            question: "What is the default value of an int variable in Java?",
            options: ["null", "0", "undefined", "-1"],
            correct: 1,
            difficulty: "easy",
            explanation: "The default value of an int (and all numeric primitives) in Java is 0."
        },
        {
            question: "Which operator is used to compare two values for equality?",
            options: ["=", "==", "===", "equals"],
            correct: 1,
            difficulty: "easy",
            explanation: "The == operator compares two primitive values for equality. For objects, use .equals() method."
        },
        {
            question: "What is the result of 17 % 5?",
            options: ["3", "2", "3.4", "17"],
            correct: 1,
            difficulty: "medium",
            explanation: "The modulo operator (%) returns the remainder. 17 ÷ 5 = 3 remainder 2, so 17 % 5 = 2."
        },
        {
            question: "Which of the following is NOT a primitive data type in Java?",
            options: ["int", "boolean", "String", "double"],
            correct: 2,
            difficulty: "medium",
            explanation: "String is a class (reference type), not a primitive. The 8 primitives are: byte, short, int, long, float, double, boolean, char."
        },
        {
            question: "What does the ++ operator do?",
            options: ["Adds 2 to a variable", "Increments by 1", "Doubles the value", "Nothing"],
            correct: 1,
            difficulty: "easy",
            explanation: "The ++ operator increments a variable by 1. For example, x++ is equivalent to x = x + 1."
        },
        {
            question: "What is the output of: System.out.println(\"Hello\" + \"World\");",
            options: ["Hello World", "HelloWorld", "Hello + World", "Error"],
            correct: 1,
            difficulty: "easy",
            explanation: "The + operator concatenates strings without adding spaces. \"Hello\" + \"World\" = \"HelloWorld\"."
        },
        {
            question: "Which keyword is used to define a constant in Java?",
            options: ["const", "final", "constant", "static"],
            correct: 1,
            difficulty: "medium",
            explanation: "The 'final' keyword makes a variable constant - its value cannot be changed after initialization."
        }
    ],
    selection: [
        {
            question: "What is the correct syntax for an if statement in Java?",
            options: ["if x > 5 then {}", "if (x > 5) {}", "if x > 5 {}", "if [x > 5] {}"],
            correct: 1,
            difficulty: "easy",
            explanation: "In Java, the condition must be enclosed in parentheses: if (condition) { code }"
        },
        {
            question: "What will be printed?",
            code: "int x = 10;\nif (x > 5) {\n    System.out.println(\"A\");\n} else {\n    System.out.println(\"B\");\n}",
            options: ["A", "B", "AB", "Nothing"],
            correct: 0,
            difficulty: "easy",
            explanation: "Since x (10) is greater than 5, the condition is true and \"A\" is printed."
        },
        {
            question: "Which operator means 'AND' in Java?",
            options: ["&", "&&", "AND", "||"],
            correct: 1,
            difficulty: "easy",
            explanation: "&& is the logical AND operator. Both conditions must be true for the result to be true."
        },
        {
            question: "What is the output?",
            code: "int score = 75;\nif (score >= 90) {\n    System.out.println(\"A\");\n} else if (score >= 80) {\n    System.out.println(\"B\");\n} else if (score >= 70) {\n    System.out.println(\"C\");\n} else {\n    System.out.println(\"F\");\n}",
            options: ["A", "B", "C", "F"],
            correct: 2,
            difficulty: "medium",
            explanation: "75 is not >= 90, not >= 80, but is >= 70, so \"C\" is printed."
        },
        {
            question: "What keyword ends a case in a switch statement?",
            options: ["end", "stop", "break", "exit"],
            correct: 2,
            difficulty: "easy",
            explanation: "The 'break' keyword exits the switch block. Without it, execution \"falls through\" to the next case."
        },
        {
            question: "What is the output?",
            code: "int day = 3;\nswitch (day) {\n    case 1: System.out.println(\"Mon\"); break;\n    case 2: System.out.println(\"Tue\"); break;\n    case 3: System.out.println(\"Wed\"); break;\n    default: System.out.println(\"Other\");\n}",
            options: ["Mon", "Tue", "Wed", "Other"],
            correct: 2,
            difficulty: "easy",
            explanation: "day is 3, which matches case 3, so \"Wed\" is printed."
        },
        {
            question: "Which expression checks if x is between 1 and 10 (inclusive)?",
            options: ["1 < x < 10", "x >= 1 && x <= 10", "x > 1 AND x < 10", "x between 1 and 10"],
            correct: 1,
            difficulty: "medium",
            explanation: "Use && to combine conditions. x >= 1 && x <= 10 checks if x is at least 1 AND at most 10."
        },
        {
            question: "What is the ternary operator in Java?",
            options: ["if-else", "? :", "switch", "&&"],
            correct: 1,
            difficulty: "medium",
            explanation: "The ternary operator ? : is a shorthand for if-else: condition ? valueIfTrue : valueIfFalse"
        },
        {
            question: "What is the output?",
            code: "boolean a = true;\nboolean b = false;\nSystem.out.println(a || b);",
            options: ["true", "false", "1", "Error"],
            correct: 0,
            difficulty: "easy",
            explanation: "|| is OR operator. true OR false = true. At least one condition is true."
        },
        {
            question: "What happens if no case matches and there's no default?",
            options: ["Error occurs", "First case runs", "Nothing happens", "Last case runs"],
            correct: 2,
            difficulty: "medium",
            explanation: "If no case matches and there's no default block, the switch statement does nothing and execution continues."
        }
    ],
    loops: [
        {
            question: "How many times will this loop execute?",
            code: "for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}",
            options: ["4 times", "5 times", "6 times", "Infinite"],
            correct: 1,
            difficulty: "easy",
            explanation: "i starts at 0 and runs while i < 5. Values: 0,1,2,3,4 = 5 iterations."
        },
        {
            question: "What is the output?",
            code: "int i = 0;\nwhile (i < 3) {\n    System.out.print(i + \" \");\n    i++;\n}",
            options: ["0 1 2", "1 2 3", "0 1 2 3", "1 2"],
            correct: 0,
            difficulty: "easy",
            explanation: "Prints i then increments. Output: 0 1 2 (stops when i becomes 3)."
        },
        {
            question: "What is the difference between while and do-while?",
            options: ["No difference", "do-while always runs at least once", "while is faster", "do-while can't use break"],
            correct: 1,
            difficulty: "medium",
            explanation: "do-while checks the condition AFTER executing, so it always runs at least once."
        },
        {
            question: "What does the 'break' statement do in a loop?",
            options: ["Skips current iteration", "Exits the loop", "Restarts the loop", "Pauses the loop"],
            correct: 1,
            difficulty: "easy",
            explanation: "break immediately exits the loop, continuing with code after the loop."
        },
        {
            question: "What does the 'continue' statement do?",
            options: ["Exits the loop", "Skips to next iteration", "Repeats current iteration", "Ends the program"],
            correct: 1,
            difficulty: "easy",
            explanation: "continue skips the rest of the current iteration and starts the next one."
        },
        {
            question: "What is the output?",
            code: "for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 2; j++) {\n        System.out.print(\"*\");\n    }\n    System.out.println();\n}",
            options: ["3 rows of 2 stars", "2 rows of 3 stars", "6 stars in one line", "Error"],
            correct: 0,
            difficulty: "medium",
            explanation: "Outer loop runs 3 times (rows), inner loop prints 2 stars per row."
        },
        {
            question: "How do you create an infinite loop?",
            options: ["for (;;)", "while (true)", "Both A and B", "Not possible"],
            correct: 2,
            difficulty: "medium",
            explanation: "Both for(;;) and while(true) create infinite loops that run until break or return."
        },
        {
            question: "What is the output?",
            code: "int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}\nSystem.out.println(sum);",
            options: ["5", "10", "15", "20"],
            correct: 2,
            difficulty: "medium",
            explanation: "sum = 1+2+3+4+5 = 15"
        },
        {
            question: "What is wrong with this loop?",
            code: "for (int i = 0; i < 10; i--) {\n    System.out.println(i);\n}",
            options: ["Syntax error", "Infinite loop", "Runs 10 times", "Nothing wrong"],
            correct: 1,
            difficulty: "hard",
            explanation: "i starts at 0 and decreases (i--), so i < 10 is always true. This is an infinite loop."
        },
        {
            question: "What is the output?",
            code: "for (int i = 0; i < 5; i++) {\n    if (i == 3) break;\n    System.out.print(i + \" \");\n}",
            options: ["0 1 2", "0 1 2 3", "0 1 2 3 4", "3"],
            correct: 0,
            difficulty: "medium",
            explanation: "Prints 0, 1, 2. When i=3, break exits the loop before printing."
        }
    ],
    arrays: [
        {
            question: "How do you declare an integer array in Java?",
            options: ["int arr[];", "int[] arr;", "Both A and B", "array int arr;"],
            correct: 2,
            difficulty: "easy",
            explanation: "Both int arr[] and int[] arr are valid array declarations in Java."
        },
        {
            question: "What is the index of the first element in an array?",
            options: ["0", "1", "-1", "It depends"],
            correct: 0,
            difficulty: "easy",
            explanation: "Arrays in Java are 0-indexed. The first element is at index 0."
        },
        {
            question: "What is the output?",
            code: "int[] nums = {10, 20, 30, 40, 50};\nSystem.out.println(nums[2]);",
            options: ["10", "20", "30", "40"],
            correct: 2,
            difficulty: "easy",
            explanation: "Index 2 is the third element: nums[0]=10, nums[1]=20, nums[2]=30."
        },
        {
            question: "How do you get the length of an array named 'arr'?",
            options: ["arr.length()", "arr.size()", "arr.length", "length(arr)"],
            correct: 2,
            difficulty: "easy",
            explanation: "Arrays have a 'length' property (not a method), accessed as arr.length."
        },
        {
            question: "What happens if you access an array index out of bounds?",
            options: ["Returns null", "Returns 0", "ArrayIndexOutOfBoundsException", "Wraps around"],
            correct: 2,
            difficulty: "medium",
            explanation: "Accessing an invalid index throws ArrayIndexOutOfBoundsException at runtime."
        },
        {
            question: "How do you create a 2D array with 3 rows and 4 columns?",
            options: ["int[][] arr = new int[3][4];", "int arr[3][4];", "int[3][4] arr;", "int arr = new int[3,4];"],
            correct: 0,
            difficulty: "medium",
            explanation: "new int[rows][columns] creates a 2D array. new int[3][4] = 3 rows, 4 columns."
        },
        {
            question: "What is the output?",
            code: "int[] arr = {1, 2, 3};\nSystem.out.println(arr.length);",
            options: ["2", "3", "4", "Error"],
            correct: 1,
            difficulty: "easy",
            explanation: "The array has 3 elements, so arr.length returns 3."
        },
        {
            question: "Which loop is best for iterating through all array elements?",
            options: ["while loop", "do-while loop", "for-each loop", "None of these"],
            correct: 2,
            difficulty: "medium",
            explanation: "The for-each loop (for (type var : array)) is designed for iterating through arrays."
        },
        {
            question: "What is the output?",
            code: "int[][] matrix = {{1,2}, {3,4}, {5,6}};\nSystem.out.println(matrix[1][0]);",
            options: ["1", "2", "3", "4"],
            correct: 2,
            difficulty: "medium",
            explanation: "matrix[1] is the second row {3,4}, and [0] is its first element: 3."
        },
        {
            question: "What is the default value of elements in a new int array?",
            options: ["null", "0", "undefined", "-1"],
            correct: 1,
            difficulty: "easy",
            explanation: "Numeric array elements default to 0, boolean to false, objects to null."
        }
    ],
    methods: [
        {
            question: "What keyword is used to return a value from a method?",
            options: ["send", "return", "output", "give"],
            correct: 1,
            difficulty: "easy",
            explanation: "The 'return' keyword sends a value back to the caller and exits the method."
        },
        {
            question: "What does 'void' mean in a method declaration?",
            options: ["Returns null", "Returns nothing", "Returns 0", "Invalid method"],
            correct: 1,
            difficulty: "easy",
            explanation: "void indicates the method doesn't return any value."
        },
        {
            question: "What is the output?",
            code: "public static int add(int a, int b) {\n    return a + b;\n}\n// In main:\nSystem.out.println(add(3, 4));",
            options: ["3", "4", "7", "34"],
            correct: 2,
            difficulty: "easy",
            explanation: "The method adds 3 + 4 and returns 7."
        },
        {
            question: "What is method overloading?",
            options: ["Too many methods", "Same name, different parameters", "Calling a method multiple times", "Method error"],
            correct: 1,
            difficulty: "medium",
            explanation: "Overloading means multiple methods with the same name but different parameter lists."
        },
        {
            question: "What is recursion?",
            options: ["A loop", "A method calling itself", "Method overloading", "A type of array"],
            correct: 1,
            difficulty: "medium",
            explanation: "Recursion is when a method calls itself, typically with a base case to stop."
        },
        {
            question: "What is the output?",
            code: "public static int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n// In main:\nSystem.out.println(factorial(4));",
            options: ["4", "10", "24", "120"],
            correct: 2,
            difficulty: "hard",
            explanation: "factorial(4) = 4 × 3 × 2 × 1 = 24"
        },
        {
            question: "What are method parameters?",
            options: ["Return values", "Input values passed to method", "Local variables", "Method names"],
            correct: 1,
            difficulty: "easy",
            explanation: "Parameters are variables that receive values when the method is called."
        },
        {
            question: "What happens if you don't return a value from a non-void method?",
            options: ["Returns 0", "Returns null", "Compilation error", "Runtime error"],
            correct: 2,
            difficulty: "medium",
            explanation: "A non-void method must return a value. Missing return causes a compilation error."
        },
        {
            question: "What is the scope of a parameter variable?",
            options: ["Entire program", "Entire class", "Only within the method", "All methods"],
            correct: 2,
            difficulty: "medium",
            explanation: "Parameters are local to the method - they only exist within that method."
        },
        {
            question: "Which is a valid method signature for overloading?",
            code: "public static int calculate(int x) { ... }",
            options: ["public static int calculate(int x)", "public static double calculate(int x)", "public static int calculate(int x, int y)", "public static int calculate(int num)"],
            correct: 2,
            difficulty: "hard",
            explanation: "Overloading requires different parameter types or count. Only option C has different parameters."
        }
    ],
    mixed: []
};

// Generate mixed quiz from all topics
function generateMixedQuiz() {
    const allTopics = ['basics', 'selection', 'loops', 'arrays', 'methods'];
    let mixedQuestions = [];
    
    allTopics.forEach(topic => {
        // Get 3 random questions from each topic
        const shuffled = [...quizData[topic]].sort(() => Math.random() - 0.5);
        mixedQuestions = mixedQuestions.concat(shuffled.slice(0, 3));
    });
    
    // Shuffle the final array
    return mixedQuestions.sort(() => Math.random() - 0.5);
}

// Quiz State
let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let currentTopic = '';
let selectedAnswer = null;  // Track selected answer before submission
let isAnswerSubmitted = false;  // Track if answer has been submitted

// Start Quiz
function startQuiz(topic) {
    currentTopic = topic;
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    if (topic === 'mixed') {
        currentQuiz = generateMixedQuiz();
    } else {
        // Shuffle questions
        currentQuiz = [...quizData[topic]].sort(() => Math.random() - 0.5);
    }
    
    // Hide topic selection, show quiz
    document.getElementById('quiz-topics').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    
    // Load first question
    loadQuestion();
}

// Load Question
function loadQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    const totalQuestions = currentQuiz.length;
    
    // Update progress
    document.getElementById('question-number').textContent = 
        `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    document.getElementById('score-display').textContent = `Score: ${score}`;
    document.getElementById('progress-fill').style.width = 
        `${((currentQuestionIndex) / totalQuestions) * 100}%`;
    
    // Set difficulty badge
    const difficultyBadge = document.getElementById('difficulty-badge');
    difficultyBadge.textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
    difficultyBadge.className = `difficulty-badge ${question.difficulty}`;
    
    // Set question text
    document.getElementById('question-text').textContent = question.question;
    
    // Handle code block
    const codeBlock = document.getElementById('question-code');
    if (question.code) {
        codeBlock.style.display = 'block';
        document.getElementById('code-content').textContent = question.code;
    } else {
        codeBlock.style.display = 'none';
    }
    
    // Generate answer options
    const optionsContainer = document.getElementById('answer-options');
    optionsContainer.innerHTML = '';
    
    const letters = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';
        optionDiv.onclick = () => selectAnswer(index);
        optionDiv.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span class="option-text">${option}</span>
            <span class="option-icon"></span>
        `;
        optionsContainer.appendChild(optionDiv);
    });
    
    // Reset state for new question
    selectedAnswer = null;
    isAnswerSubmitted = false;
    
    // Hide feedback and disable buttons
    document.getElementById('feedback-box').style.display = 'none';
    document.getElementById('btn-submit').disabled = true;
    document.getElementById('btn-submit').style.display = 'inline-block';
    document.getElementById('btn-next').style.display = 'none';
    
    // Update button text for last question
    document.getElementById('btn-next').textContent = 
        currentQuestionIndex === totalQuestions - 1 ? 'See Results' : 'Next Question';
}

// Select Answer (just highlight, don't evaluate yet)
function selectAnswer(selectedIndex) {
    // Don't allow changing answer after submission
    if (isAnswerSubmitted) return;
    
    const options = document.querySelectorAll('.answer-option');
    
    // Remove previous selection
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Mark new selection
    options[selectedIndex].classList.add('selected');
    selectedAnswer = selectedIndex;
    
    // Enable submit button
    document.getElementById('btn-submit').disabled = false;
}

// Submit Answer (evaluate and show feedback)
function submitAnswer() {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    
    isAnswerSubmitted = true;
    
    const question = currentQuiz[currentQuestionIndex];
    const options = document.querySelectorAll('.answer-option');
    const isCorrect = selectedAnswer === question.correct;
    
    // Disable all options
    options.forEach(opt => opt.classList.add('disabled'));
    
    if (isCorrect) {
        options[selectedAnswer].classList.add('correct');
        options[selectedAnswer].querySelector('.option-icon').textContent = '✓';
        score++;
    } else {
        options[selectedAnswer].classList.add('incorrect');
        options[selectedAnswer].querySelector('.option-icon').textContent = '✗';
        // Show correct answer
        options[question.correct].classList.add('show-correct');
        options[question.correct].querySelector('.option-icon').textContent = '✓';
    }
    
    // Store user answer
    userAnswers.push({
        question: question.question,
        userAnswer: question.options[selectedAnswer],
        correctAnswer: question.options[question.correct],
        isCorrect: isCorrect
    });
    
    // Show feedback
    showFeedback(isCorrect, question.explanation);
    
    // Hide submit, show next button
    document.getElementById('btn-submit').style.display = 'none';
    document.getElementById('btn-next').style.display = 'inline-block';
    document.getElementById('score-display').textContent = `Score: ${score}`;
}

// Show Feedback
function showFeedback(isCorrect, explanation) {
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackText = document.getElementById('feedback-text');
    
    feedbackBox.style.display = 'flex';
    feedbackBox.className = `feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;
    
    if (isCorrect) {
        feedbackIcon.textContent = '✓';
        feedbackText.innerHTML = `<h4>Correct!</h4><p>${explanation}</p>`;
    } else {
        feedbackIcon.textContent = '✗';
        feedbackText.innerHTML = `<h4>Incorrect</h4><p>${explanation}</p>`;
    }
}

// Next Question
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= currentQuiz.length) {
        showResults();
    } else {
        loadQuestion();
    }
}

// Show Results
function showResults() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    const totalQuestions = currentQuiz.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Set results icon and title based on score
    const resultsIcon = document.getElementById('results-icon');
    const resultsTitle = document.getElementById('results-title');
    const scoreMessage = document.getElementById('score-message');
    
    if (percentage >= 90) {
        resultsIcon.textContent = 'A+';
        resultsTitle.textContent = 'Excellent!';
        scoreMessage.textContent = "Outstanding performance! You've mastered this topic!";
        scoreMessage.className = 'score-message excellent';
    } else if (percentage >= 70) {
        resultsIcon.textContent = 'B+';
        resultsTitle.textContent = 'Great Job!';
        scoreMessage.textContent = "Good work! You have a solid understanding.";
        scoreMessage.className = 'score-message good';
    } else if (percentage >= 50) {
        resultsIcon.textContent = 'C';
        resultsTitle.textContent = 'Keep Learning!';
        scoreMessage.textContent = "You're getting there! Review the topics you missed.";
        scoreMessage.className = 'score-message average';
    } else {
        resultsIcon.textContent = 'F';
        resultsTitle.textContent = 'Keep Practicing!';
        scoreMessage.textContent = "Don't give up! Review the lessons and try again.";
        scoreMessage.className = 'score-message needs-work';
    }
    
    // Set score display
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    document.getElementById('score-details').textContent = 
        `You got ${score} out of ${totalQuestions} questions correct`;
    
    // Generate review list
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    
    userAnswers.forEach((answer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        
        let reviewContent = `
            <span class="review-icon">${answer.isCorrect ? '✓' : '✗'}</span>
            <div class="review-content">
                <div class="review-question">${index + 1}. ${answer.question}</div>
                <div class="review-answer">
        `;
        
        if (answer.isCorrect) {
            reviewContent += `Your answer: <span class="correct-answer">${answer.userAnswer}</span>`;
        } else {
            reviewContent += `Your answer: <span class="user-answer">${answer.userAnswer}</span><br>`;
            reviewContent += `Correct answer: <span class="correct-answer">${answer.correctAnswer}</span>`;
        }
        
        reviewContent += '</div></div>';
        reviewItem.innerHTML = reviewContent;
        reviewList.appendChild(reviewItem);
    });
}

// Retry Quiz
function retryQuiz() {
    startQuiz(currentTopic);
}

// Show Topics
function showTopics() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-topics').style.display = 'block';
}

// Quit Quiz
function quitQuiz() {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
        showTopics();
    }
}
