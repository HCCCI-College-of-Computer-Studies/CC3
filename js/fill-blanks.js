/**
 * Fill in the Blanks Quiz System
 * Code Completion Exercises for Java Programming
 */

const FillBlanksQuiz = {
    // Store all exercises
    exercises: [],
    
    // Initialize the system
    init() {
        this.loadExercises();
        this.renderExercises();
        this.attachEventListeners();
    },
    
    // Load exercises from data attributes or predefined set
    loadExercises() {
        const containers = document.querySelectorAll('.fill-blanks-exercise');
        containers.forEach((container, index) => {
            const exerciseId = container.dataset.exerciseId || `exercise-${index}`;
            const exercise = {
                id: exerciseId,
                element: container,
                blanks: [],
                completed: false
            };
            
            // Parse blanks from data attribute
            const blanksData = container.dataset.blanks;
            if (blanksData) {
                exercise.blanks = JSON.parse(blanksData);
            }
            
            this.exercises.push(exercise);
        });
    },
    
    // Render exercises in the DOM
    renderExercises() {
        this.exercises.forEach(exercise => {
            this.renderExercise(exercise);
        });
    },
    
    // Render a single exercise
    renderExercise(exercise) {
        const container = exercise.element;
        const codeContent = container.querySelector('.code-fill-content pre');
        
        if (!codeContent) return;
        
        // Replace blank placeholders with input fields
        let html = codeContent.innerHTML;
        let blankIndex = 0;
        
        // Replace ___BLANK___ markers with input fields
        html = html.replace(/___BLANK___/g, () => {
            const blank = exercise.blanks[blankIndex];
            const width = blank ? Math.max(blank.answer.length * 12, 80) : 80;
            const placeholder = blank?.placeholder || 'fill in';
            const input = `<input type="text" class="blank-input" data-exercise="${exercise.id}" data-index="${blankIndex}" placeholder="${placeholder}" style="width: ${width}px" autocomplete="off" spellcheck="false">`;
            blankIndex++;
            return input;
        });
        
        codeContent.innerHTML = html;
        
        // Add progress indicator
        this.addProgressIndicator(exercise);
    },
    
    // Add progress dots below the exercise
    addProgressIndicator(exercise) {
        const container = exercise.element;
        const existing = container.querySelector('.blanks-progress');
        if (existing) existing.remove();
        
        const numBlanks = exercise.blanks.length;
        if (numBlanks === 0) return;
        
        const progressHtml = `
            <div class="blanks-progress">
                <span>Progress:</span>
                <div class="progress-dots">
                    ${exercise.blanks.map((_, i) => `<div class="progress-dot" data-index="${i}"></div>`).join('')}
                </div>
                <span class="progress-text">0/${numBlanks} correct</span>
            </div>
        `;
        
        const feedbackBox = container.querySelector('.fill-feedback');
        if (feedbackBox) {
            feedbackBox.insertAdjacentHTML('beforebegin', progressHtml);
        } else {
            container.insertAdjacentHTML('beforeend', progressHtml);
        }
    },
    
    // Attach event listeners
    attachEventListeners() {
        // Check buttons
        document.querySelectorAll('.btn-check-code').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.closest('.fill-blanks-exercise').dataset.exerciseId;
                this.checkAnswers(exerciseId);
            });
        });
        
        // Reset buttons
        document.querySelectorAll('.btn-reset-blanks').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.closest('.fill-blanks-exercise').dataset.exerciseId;
                this.resetExercise(exerciseId);
            });
        });
        
        // Show answer buttons
        document.querySelectorAll('.btn-show-answer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.closest('.fill-blanks-exercise').dataset.exerciseId;
                this.showAnswers(exerciseId);
            });
        });
        
        // Input field events
        document.querySelectorAll('.blank-input').forEach(input => {
            // Check on Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const exerciseId = input.dataset.exercise;
                    this.checkAnswers(exerciseId);
                }
            });
            
            // Move to next blank on Tab
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.handleTabNavigation(e, input);
                }
            });
            
            // Clear status when typing
            input.addEventListener('input', () => {
                input.classList.remove('correct', 'incorrect');
            });
        });
    },
    
    // Handle Tab navigation between blanks
    handleTabNavigation(e, currentInput) {
        const exerciseId = currentInput.dataset.exercise;
        const currentIndex = parseInt(currentInput.dataset.index);
        const inputs = document.querySelectorAll(`.blank-input[data-exercise="${exerciseId}"]`);
        
        if (!e.shiftKey && currentIndex < inputs.length - 1) {
            e.preventDefault();
            inputs[currentIndex + 1].focus();
        } else if (e.shiftKey && currentIndex > 0) {
            e.preventDefault();
            inputs[currentIndex - 1].focus();
        }
    },
    
    // Check all answers for an exercise
    checkAnswers(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;
        
        const inputs = document.querySelectorAll(`.blank-input[data-exercise="${exerciseId}"]`);
        let correct = 0;
        let total = exercise.blanks.length;
        
        inputs.forEach((input, index) => {
            const blank = exercise.blanks[index];
            const userAnswer = input.value.trim();
            
            // Check if answer is correct (support multiple correct answers)
            const correctAnswers = Array.isArray(blank.answer) ? blank.answer : [blank.answer];
            const isCorrect = correctAnswers.some(ans => 
                blank.caseSensitive !== false ? userAnswer === ans : userAnswer.toLowerCase() === ans.toLowerCase()
            );
            
            if (isCorrect) {
                input.classList.remove('incorrect');
                input.classList.add('correct');
                correct++;
                this.updateProgressDot(exerciseId, index, 'correct');
            } else if (userAnswer !== '') {
                input.classList.remove('correct');
                input.classList.add('incorrect');
                this.updateProgressDot(exerciseId, index, 'incorrect');
            }
        });
        
        // Update progress text
        const progressText = exercise.element.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${correct}/${total} correct`;
        }
        
        // Show feedback
        this.showFeedback(exercise, correct, total);
    },
    
    // Update progress dot
    updateProgressDot(exerciseId, index, status) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;
        
        const dot = exercise.element.querySelector(`.progress-dot[data-index="${index}"]`);
        if (dot) {
            dot.classList.remove('filled', 'wrong');
            if (status === 'correct') {
                dot.classList.add('filled');
            } else if (status === 'incorrect') {
                dot.classList.add('wrong');
            }
        }
    },
    
    // Show feedback message
    showFeedback(exercise, correct, total) {
        let feedbackBox = exercise.element.querySelector('.fill-feedback');
        
        if (!feedbackBox) {
            feedbackBox = document.createElement('div');
            feedbackBox.className = 'fill-feedback';
            exercise.element.appendChild(feedbackBox);
        }
        
        let title, message, type;
        
        if (correct === total) {
            title = 'Excellent!';
            message = 'All answers are correct! Great job understanding the code.';
            type = 'success';
            exercise.completed = true;
        } else if (correct > 0) {
            title = 'Almost There!';
            message = `You got ${correct} out of ${total} correct. Review the incorrect answers and try again.`;
            type = 'partial';
        } else {
            title = 'Keep Trying!';
            message = 'None of the answers are correct yet. Check the hint or try again.';
            type = 'error';
        }
        
        feedbackBox.className = `fill-feedback show ${type}`;
        feedbackBox.innerHTML = `<h5>${title}</h5><p>${message}</p>`;
    },
    
    // Reset exercise
    resetExercise(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;
        
        const inputs = document.querySelectorAll(`.blank-input[data-exercise="${exerciseId}"]`);
        inputs.forEach((input, index) => {
            input.value = '';
            input.classList.remove('correct', 'incorrect');
            this.updateProgressDot(exerciseId, index, 'reset');
        });
        
        // Reset progress
        const dots = exercise.element.querySelectorAll('.progress-dot');
        dots.forEach(dot => dot.classList.remove('filled', 'wrong'));
        
        const progressText = exercise.element.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `0/${exercise.blanks.length} correct`;
        }
        
        // Hide feedback
        const feedbackBox = exercise.element.querySelector('.fill-feedback');
        if (feedbackBox) {
            feedbackBox.classList.remove('show');
        }
        
        // Hide answer reveal
        const answerReveal = exercise.element.querySelector('.answer-reveal');
        if (answerReveal) {
            answerReveal.classList.remove('show');
        }
        
        // Focus first input
        if (inputs.length > 0) {
            inputs[0].focus();
        }
    },
    
    // Show correct answers
    showAnswers(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return;
        
        let answerReveal = exercise.element.querySelector('.answer-reveal');
        
        if (!answerReveal) {
            answerReveal = document.createElement('div');
            answerReveal.className = 'answer-reveal';
            exercise.element.appendChild(answerReveal);
        }
        
        // Build answer list
        const answerList = exercise.blanks.map((blank, index) => {
            const answer = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer;
            return `Blank ${index + 1}: ${answer}`;
        }).join('\n');
        
        answerReveal.innerHTML = `
            <h5>Correct Answers:</h5>
            <code>${answerList}</code>
        `;
        answerReveal.classList.add('show');
        
        // Also fill in the inputs
        const inputs = document.querySelectorAll(`.blank-input[data-exercise="${exerciseId}"]`);
        inputs.forEach((input, index) => {
            const blank = exercise.blanks[index];
            const answer = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer;
            input.value = answer;
            input.classList.remove('incorrect');
            input.classList.add('correct');
            this.updateProgressDot(exerciseId, index, 'correct');
        });
    }
};

// Predefined exercises data (can be used for quick setup)
const FillBlanksExercises = {
    // Java Basics exercises
    basics: [
        {
            id: 'hello-world',
            title: 'Hello World Program',
            hint: 'Every Java program starts with a class and a main method.',
            code: `<span class="kw">public class</span> <span class="type">___BLANK___</span> {
    <span class="kw">public static void</span> ___BLANK___(<span class="type">String</span>[] args) {
        System.out.___BLANK___(<span class="str">"Hello, World!"</span>);
    }
}`,
            blanks: [
                { answer: 'HelloWorld', placeholder: 'class name' },
                { answer: 'main', placeholder: 'method name' },
                { answer: 'println', placeholder: 'print method' }
            ]
        },
        {
            id: 'variables',
            title: 'Variable Declaration',
            hint: 'Remember the syntax: type variableName = value;',
            code: `<span class="comment">// Declare an integer variable</span>
___BLANK___ age = <span class="num">25</span>;

<span class="comment">// Declare a string variable</span>
___BLANK___ name = <span class="str">"John"</span>;

<span class="comment">// Declare a decimal number</span>
___BLANK___ price = <span class="num">19.99</span>;`,
            blanks: [
                { answer: 'int', placeholder: 'data type' },
                { answer: 'String', placeholder: 'data type' },
                { answer: 'double', placeholder: 'data type' }
            ]
        }
    ],
    
    // Selection structures
    selection: [
        {
            id: 'if-else',
            title: 'If-Else Statement',
            hint: 'Use comparison operators: ==, >, <, >=, <=, !=',
            code: `<span class="type">int</span> score = <span class="num">85</span>;

___BLANK___ (score ___BLANK___ <span class="num">60</span>) {
    System.out.println(<span class="str">"Passed!"</span>);
} ___BLANK___ {
    System.out.println(<span class="str">"Failed!"</span>);
}`,
            blanks: [
                { answer: 'if', placeholder: 'keyword' },
                { answer: ['>=', '>'], placeholder: 'operator' },
                { answer: 'else', placeholder: 'keyword' }
            ]
        },
        {
            id: 'switch',
            title: 'Switch Statement',
            hint: 'Remember to use break after each case!',
            code: `<span class="type">int</span> day = <span class="num">3</span>;

___BLANK___ (day) {
    ___BLANK___ <span class="num">1</span>:
        System.out.println(<span class="str">"Monday"</span>);
        ___BLANK___;
    <span class="kw">case</span> <span class="num">2</span>:
        System.out.println(<span class="str">"Tuesday"</span>);
        <span class="kw">break</span>;
    ___BLANK___:
        System.out.println(<span class="str">"Invalid day"</span>);
}`,
            blanks: [
                { answer: 'switch', placeholder: 'keyword' },
                { answer: 'case', placeholder: 'keyword' },
                { answer: 'break', placeholder: 'keyword' },
                { answer: 'default', placeholder: 'keyword' }
            ]
        }
    ],
    
    // Loops
    loops: [
        {
            id: 'for-loop',
            title: 'For Loop',
            hint: 'For loop has 3 parts: initialization; condition; increment',
            code: `<span class="comment">// Print numbers 1 to 5</span>
___BLANK___ (<span class="type">int</span> i = ___BLANK___; i ___BLANK___ <span class="num">5</span>; i___BLANK___) {
    System.out.println(i);
}`,
            blanks: [
                { answer: 'for', placeholder: 'keyword' },
                { answer: '1', placeholder: 'start value' },
                { answer: '<=', placeholder: 'operator' },
                { answer: '++', placeholder: 'increment' }
            ]
        },
        {
            id: 'while-loop',
            title: 'While Loop',
            hint: 'While loop continues as long as the condition is true.',
            code: `<span class="type">int</span> count = <span class="num">0</span>;

___BLANK___ (count ___BLANK___ <span class="num">3</span>) {
    System.out.println(<span class="str">"Count: "</span> + count);
    count___BLANK___;
}`,
            blanks: [
                { answer: 'while', placeholder: 'keyword' },
                { answer: '<', placeholder: 'operator' },
                { answer: '++', placeholder: 'increment' }
            ]
        }
    ],
    
    // Arrays
    arrays: [
        {
            id: 'array-declaration',
            title: 'Array Declaration',
            hint: 'Arrays can be declared with type[] name = new type[size] or with values directly.',
            code: `<span class="comment">// Declare an array of integers</span>
<span class="type">int</span>___BLANK___ numbers = ___BLANK___ <span class="type">int</span>[<span class="num">5</span>];

<span class="comment">// Declare and initialize an array</span>
<span class="type">String</span>[] names = ___BLANK___<span class="str">"Alice"</span>, <span class="str">"Bob"</span>, <span class="str">"Charlie"</span>___BLANK___;`,
            blanks: [
                { answer: '[]', placeholder: 'array syntax' },
                { answer: 'new', placeholder: 'keyword' },
                { answer: '{', placeholder: 'opening' },
                { answer: '}', placeholder: 'closing' }
            ]
        },
        {
            id: 'array-loop',
            title: 'Array Iteration',
            hint: 'Use .length to get the size of an array.',
            code: `<span class="type">int</span>[] scores = {<span class="num">90</span>, <span class="num">85</span>, <span class="num">88</span>, <span class="num">92</span>};

<span class="comment">// Using traditional for loop</span>
<span class="kw">for</span> (<span class="type">int</span> i = <span class="num">0</span>; i < scores.___BLANK___; i++) {
    System.out.println(scores___BLANK___);
}

<span class="comment">// Using enhanced for loop</span>
<span class="kw">for</span> (<span class="type">int</span> score ___BLANK___ scores) {
    System.out.println(score);
}`,
            blanks: [
                { answer: 'length', placeholder: 'property' },
                { answer: '[i]', placeholder: 'index access' },
                { answer: ':', placeholder: 'separator' }
            ]
        }
    ],
    
    // Methods
    methods: [
        {
            id: 'method-definition',
            title: 'Method Definition',
            hint: 'Methods have: access modifier, return type, name, and parameters.',
            code: `<span class="comment">// Method that returns the sum of two numbers</span>
<span class="kw">public static</span> ___BLANK___ add(<span class="type">int</span> a, <span class="type">int</span> b) {
    ___BLANK___ a + b;
}

<span class="comment">// Method that prints a message (no return value)</span>
<span class="kw">public static</span> ___BLANK___ greet(<span class="type">String</span> name) {
    System.out.println(<span class="str">"Hello, "</span> + name);
}`,
            blanks: [
                { answer: 'int', placeholder: 'return type' },
                { answer: 'return', placeholder: 'keyword' },
                { answer: 'void', placeholder: 'return type' }
            ]
        },
        {
            id: 'method-call',
            title: 'Method Invocation',
            hint: 'Call methods by their name followed by parentheses with arguments.',
            code: `<span class="kw">public static void</span> main(<span class="type">String</span>[] args) {
    <span class="comment">// Call the add method</span>
    <span class="type">int</span> result = ___BLANK___(<span class="num">5</span>, <span class="num">3</span>);
    
    <span class="comment">// Print the result</span>
    System.out.___BLANK___(result);
    
    <span class="comment">// Call the greet method</span>
    ___BLANK___(<span class="str">"World"</span>);
}`,
            blanks: [
                { answer: 'add', placeholder: 'method name' },
                { answer: 'println', placeholder: 'print method' },
                { answer: 'greet', placeholder: 'method name' }
            ]
        }
    ]
};

// Helper function to create fill-in-the-blank exercise HTML
function createFillBlanksExercise(exerciseData) {
    const { id, title, hint, code, blanks } = exerciseData;
    const blanksJson = JSON.stringify(blanks).replace(/"/g, '&quot;');
    
    return `
    <div class="fill-blanks-section">
        <h4>Complete the Code: ${title}</h4>
        <p>Fill in the blanks to complete the Java code.</p>
        
        <div class="fill-blanks-exercise" data-exercise-id="${id}" data-blanks="${blanksJson}">
            <div class="code-fill-container">
                <div class="code-fill-header">
                    <div class="code-fill-title">
                        <span class="code-fill-lang">JAVA</span>
                        <span class="code-fill-label">${title}</span>
                    </div>
                    <div class="code-fill-actions">
                        <button class="btn-check-code">Check Answers</button>
                        <button class="btn-reset-blanks">Reset</button>
                        <button class="btn-show-answer">Show Answer</button>
                    </div>
                </div>
                <div class="code-fill-content">
                    <pre>${code}</pre>
                </div>
            </div>
            
            ${hint ? `
            <div class="hint-box show">
                <h5>Hint:</h5>
                <p>${hint}</p>
            </div>
            ` : ''}
            
            <div class="fill-feedback"></div>
        </div>
    </div>
    `;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FillBlanksQuiz.init();
});
