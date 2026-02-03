/**
 * Interactive Code Runner for CC3 Learning Platform
 * Allows students to edit and run code snippets directly in the browser
 * Uses Piston API for code execution (free, no API key required)
 */

class CodeRunner {
    constructor() {
        this.pistonAPI = 'https://emkc.org/api/v2/piston/execute';
        this.languageVersions = {
            'java': { language: 'java', version: '15.0.2' },
            'python': { language: 'python', version: '3.10.0' },
            'javascript': { language: 'javascript', version: '18.15.0' },
            'c': { language: 'c', version: '10.2.0' },
            'cpp': { language: 'cpp', version: '10.2.0' }
        };
        this.init();
    }

    init() {
        // Find all interactive code blocks and convert them
        document.querySelectorAll('pre code.interactive, .code-runner-target').forEach((block, index) => {
            this.createInteractiveEditor(block, index);
        });

        // Also initialize any manually created runners
        document.querySelectorAll('.code-runner').forEach((runner) => {
            if (!runner.classList.contains('initialized')) {
                this.initializeRunner(runner);
            }
        });
    }

    createInteractiveEditor(codeBlock, index) {
        const language = this.detectLanguage(codeBlock);
        const originalCode = codeBlock.textContent;
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-runner initialized';
        wrapper.dataset.language = language;

        wrapper.innerHTML = `
            <div class="code-runner-header">
                <div class="code-runner-title">
                    <span class="code-runner-icon">▶</span>
                    <span class="code-runner-lang">${language.toUpperCase()}</span>
                    <span class="code-runner-label">Interactive Code Editor</span>
                </div>
                <div class="code-runner-actions">
                    <button class="btn-reset" title="Reset to original code">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                            <path d="M3 3v5h5"/>
                        </svg>
                        Reset
                    </button>
                    <button class="btn-copy" title="Copy code">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    </button>
                    <button class="btn-run" title="Run code (Ctrl+Enter)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        Run
                    </button>
                </div>
            </div>
            <div class="code-runner-editor-wrapper">
                <div class="code-runner-line-numbers"></div>
                <textarea class="code-runner-editor" spellcheck="false">${this.escapeHtml(originalCode)}</textarea>
            </div>
            <div class="code-runner-input-wrapper">
                <label class="code-runner-input-label">Program Input:</label>
                <textarea class="code-runner-input" placeholder="Enter input for the program (one item per line for Scanner)..." spellcheck="false"></textarea>
            </div>
            <div class="code-runner-output-wrapper" style="display: none;">
                <div class="code-runner-output-header">
                    <div class="terminal-controls">
                        <span class="terminal-btn close" title="Close output"></span>
                        <span class="terminal-btn minimize" title="Minimize"></span>
                        <span class="terminal-btn maximize" title="Maximize"></span>
                    </div>
                    <div class="terminal-title">
                        <i>⌘</i>
                        <span>Terminal — Output</span>
                    </div>
                    <button class="btn-clear-output" title="Clear output">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14"/>
                        </svg>
                        Clear
                    </button>
                </div>
                <pre class="code-runner-output"><span class="terminal-prompt">$</span> Waiting for execution...</pre>
            </div>
            <div class="code-runner-status">
                <span class="status-text">Ready to run</span>
                <span class="status-hint">Press Ctrl+Enter to run</span>
            </div>
        `;

        // Store original code for reset
        wrapper.dataset.originalCode = originalCode;

        // Replace the original code block
        const preElement = codeBlock.closest('pre');
        if (preElement) {
            preElement.parentNode.replaceChild(wrapper, preElement);
        } else {
            codeBlock.parentNode.replaceChild(wrapper, codeBlock);
        }

        this.initializeRunner(wrapper);
    }

    initializeRunner(runner) {
        const editor = runner.querySelector('.code-runner-editor');
        const runBtn = runner.querySelector('.btn-run');
        const resetBtn = runner.querySelector('.btn-reset');
        const copyBtn = runner.querySelector('.btn-copy');
        const clearBtn = runner.querySelector('.btn-clear-output');
        const outputWrapper = runner.querySelector('.code-runner-output-wrapper');
        const output = runner.querySelector('.code-runner-output');
        const status = runner.querySelector('.status-text');
        const lineNumbers = runner.querySelector('.code-runner-line-numbers');

        // Update line numbers
        const updateLineNumbers = () => {
            const lines = editor.value.split('\n').length;
            lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => 
                `<span>${i + 1}</span>`
            ).join('');
        };

        // Initial line numbers
        updateLineNumbers();

        // Editor events
        editor.addEventListener('input', updateLineNumbers);
        editor.addEventListener('scroll', () => {
            lineNumbers.scrollTop = editor.scrollTop;
        });

        // Tab key support
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
                updateLineNumbers();
            }
            // Ctrl+Enter to run
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                runBtn.click();
            }
        });

        // Run button
        runBtn.addEventListener('click', async () => {
            const code = editor.value;
            const language = runner.dataset.language || 'java';
            const inputField = runner.querySelector('.code-runner-input');
            const inputWrapper = runner.querySelector('.code-runner-input-wrapper');
            const stdin = inputField ? inputField.value : '';

            runBtn.disabled = true;
            runBtn.innerHTML = `
                <svg class="spinner" width="16" height="16" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" transform="rotate(-90 12 12)"/>
                </svg>
                Running...
            `;
            status.textContent = 'Executing...';
            status.className = 'status-text running';

            try {
                const result = await this.executeCode(code, language, stdin);
                this.showOutputModal(runner);
                
                if (result.success) {
                    output.textContent = result.output || '(No output)';
                    output.className = 'code-runner-output success';
                    status.textContent = `Executed in ${result.time || 'N/A'}`;
                    status.className = 'status-text success';
                } else {
                    output.textContent = result.error || 'An error occurred';
                    output.className = 'code-runner-output error';
                    status.textContent = 'Execution failed';
                    status.className = 'status-text error';
                }
            } catch (err) {
                this.showOutputModal(runner);
                output.textContent = 'Error: Could not connect to execution server. Please try again.';
                output.className = 'code-runner-output error';
                status.textContent = 'Connection error';
                status.className = 'status-text error';
            }

            runBtn.disabled = false;
            runBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Run
            `;
        });

        // Reset button
        resetBtn.addEventListener('click', () => {
            editor.value = runner.dataset.originalCode || '';
            updateLineNumbers();
            outputWrapper.style.display = 'none';
            status.textContent = 'Code reset to original';
            status.className = 'status-text';
            setTimeout(() => {
                status.textContent = 'Ready to run';
            }, 2000);
        });

        // Copy button
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(editor.value);
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copied!
                `;
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });

        // Clear output button
        clearBtn.addEventListener('click', () => {
            this.closeOutputModal(runner);
        });

        // Terminal close button (red button)
        const closeBtn = runner.querySelector('.terminal-btn.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeOutputModal(runner);
            });
        }

        // Make output modal draggable
        this.makeModalDraggable(outputWrapper);

        runner.classList.add('initialized');
    }

    // Close output modal and remove backdrop
    closeOutputModal(runner) {
        const outputWrapper = runner.querySelector('.code-runner-output-wrapper');
        const backdrop = runner.querySelector('.code-runner-modal-backdrop');
        const status = runner.querySelector('.status-text');
        const output = runner.querySelector('.code-runner-output');
        
        if (outputWrapper) {
            outputWrapper.style.display = 'none';
            outputWrapper.classList.remove('dragged');
            outputWrapper.style.top = '50%';
            outputWrapper.style.left = '50%';
        }
        if (backdrop) backdrop.remove();
        if (output) output.textContent = '';
        if (status) {
            status.textContent = 'Ready to run';
            status.className = 'status-text';
        }
    }

    // Show output modal with backdrop
    showOutputModal(runner) {
        const outputWrapper = runner.querySelector('.code-runner-output-wrapper');
        
        // Create backdrop if it doesn't exist
        let backdrop = runner.querySelector('.code-runner-modal-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'code-runner-modal-backdrop';
            backdrop.addEventListener('click', () => this.closeOutputModal(runner));
            runner.appendChild(backdrop);
        }
        
        // Reset position for centering
        outputWrapper.classList.remove('dragged');
        outputWrapper.style.top = '50%';
        outputWrapper.style.left = '50%';
        outputWrapper.style.display = 'block';
    }

    // Make modal draggable
    makeModalDraggable(modal) {
        const header = modal.querySelector('.code-runner-output-header');
        if (!header) return;

        let isDragging = false;
        let startX, startY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.terminal-btn') || e.target.closest('.btn-clear-output')) return;
            
            isDragging = true;
            modal.classList.add('dragging');
            
            // If first drag, convert from centered position to absolute
            if (!modal.classList.contains('dragged')) {
                const rect = modal.getBoundingClientRect();
                modal.style.top = rect.top + 'px';
                modal.style.left = rect.left + 'px';
                modal.classList.add('dragged');
            }
            
            startX = e.clientX;
            startY = e.clientY;
            initialX = modal.offsetLeft;
            initialY = modal.offsetTop;
            
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            // Keep modal within viewport bounds
            const rect = modal.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;
            
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            modal.style.left = newX + 'px';
            modal.style.top = newY + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                modal.classList.remove('dragging');
            }
        });
    }

    async executeCode(code, language, stdin = '') {
        const langConfig = this.languageVersions[language.toLowerCase()] || this.languageVersions['java'];

        // For Java, we need to handle the class name
        let processedCode = code;
        if (language.toLowerCase() === 'java') {
            // Extract or default to Main class
            const classMatch = code.match(/public\s+class\s+(\w+)/);
            const className = classMatch ? classMatch[1] : 'Main';
            
            // If no public class, wrap in Main class
            if (!classMatch && !code.includes('class ')) {
                processedCode = `public class Main {\n    public static void main(String[] args) {\n${code}\n    }\n}`;
            }
        }

        const requestBody = {
            language: langConfig.language,
            version: langConfig.version,
            files: [{
                content: processedCode
            }]
        };

        // Add stdin if provided
        if (stdin.trim()) {
            requestBody.stdin = stdin;
        }

        const response = await fetch(this.pistonAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.run) {
            const output = data.run.stdout || '';
            const stderr = data.run.stderr || '';
            const exitCode = data.run.code;

            if (exitCode !== 0 || stderr) {
                return {
                    success: false,
                    error: stderr || `Process exited with code ${exitCode}`,
                    output: output
                };
            }

            return {
                success: true,
                output: output,
                time: data.run.time ? `${data.run.time}ms` : null
            };
        }

        return {
            success: false,
            error: data.message || 'Unknown error occurred'
        };
    }

    detectLanguage(element) {
        // Check class names for language hints
        const classes = element.className.split(' ');
        for (const cls of classes) {
            if (cls.startsWith('language-')) {
                return cls.replace('language-', '');
            }
            if (['java', 'python', 'javascript', 'c', 'cpp'].includes(cls)) {
                return cls;
            }
        }
        // Default to Java for this course
        return 'java';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Helper function to create interactive code blocks programmatically
function createCodeRunner(containerId, code, language = 'java') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="code-runner" data-language="${language}" data-original-code="${code.replace(/"/g, '&quot;')}">
            <div class="code-runner-header">
                <div class="code-runner-title">
                    <span class="code-runner-icon">▶</span>
                    <span class="code-runner-lang">${language.toUpperCase()}</span>
                    <span class="code-runner-label">Interactive Code Editor</span>
                </div>
                <div class="code-runner-actions">
                    <button class="btn-reset" title="Reset to original code">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                            <path d="M3 3v5h5"/>
                        </svg>
                        Reset
                    </button>
                    <button class="btn-copy" title="Copy code">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    </button>
                    <button class="btn-run" title="Run code (Ctrl+Enter)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        Run
                    </button>
                </div>
            </div>
            <div class="code-runner-editor-wrapper">
                <div class="code-runner-line-numbers"></div>
                <textarea class="code-runner-editor" spellcheck="false">${code}</textarea>
            </div>
            <div class="code-runner-input-wrapper">
                <label class="code-runner-input-label">Program Input:</label>
                <textarea class="code-runner-input" placeholder="Enter input for the program (one item per line for Scanner)..." spellcheck="false"></textarea>
            </div>
            <div class="code-runner-output-wrapper" style="display: none;">
                <div class="code-runner-output-header">
                    <div class="terminal-controls">
                        <span class="terminal-btn close" title="Close output"></span>
                        <span class="terminal-btn minimize" title="Minimize"></span>
                        <span class="terminal-btn maximize" title="Maximize"></span>
                    </div>
                    <div class="terminal-title">
                        <i>⌘</i>
                        <span>Terminal — Output</span>
                    </div>
                    <button class="btn-clear-output" title="Clear output">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14"/>
                        </svg>
                        Clear
                    </button>
                </div>
                <pre class="code-runner-output"><span class="terminal-prompt">$</span> Waiting for execution...</pre>
            </div>
            <div class="code-runner-status">
                <span class="status-text">Ready to run</span>
                <span class="status-hint">Press Ctrl+Enter to run</span>
            </div>
        </div>
    `;

    // Initialize the runner
    if (window.codeRunner) {
        window.codeRunner.initializeRunner(container.querySelector('.code-runner'));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.codeRunner = new CodeRunner();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CodeRunner, createCodeRunner };
}
