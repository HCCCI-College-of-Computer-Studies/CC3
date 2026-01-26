/**
 * CC3 Learning Platform - Main JavaScript
 * Handles navigation, progress tracking, and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    initMobileMenu();
    
    // Smooth Scrolling for Anchor Links
    initSmoothScroll();
    
    // Progress Animation on Scroll
    initProgressAnimation();
    
    // Active Navigation Highlight
    initActiveNavigation();
});

/**
 * Initialize Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            
            // Animate hamburger to X
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

/**
 * Initialize Smooth Scrolling
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize Progress Circle Animation
 */
function initProgressAnimation() {
    const progressCircle = document.querySelector('.progress-circle .progress-fill');
    if (!progressCircle) return;
    
    // Get progress percentage (currently set to 0)
    const progressPercent = 0; // This would come from actual progress data
    const circumference = 2 * Math.PI * 45; // r = 45
    const offset = circumference - (progressPercent / 100) * circumference;
    
    // Animate on scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressCircle.style.strokeDashoffset = offset;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const progressSection = document.querySelector('.progress-section');
    if (progressSection) {
        observer.observe(progressSection);
    }
}

/**
 * Initialize Active Navigation Highlighting
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', throttle(highlightNavigation, 100));
    highlightNavigation(); // Initial call
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Update Progress (placeholder for future implementation)
 * @param {number} lessonsCompleted - Number of completed lessons
 * @param {number} totalLessons - Total number of lessons
 */
function updateProgress(lessonsCompleted, totalLessons) {
    const progressPercent = Math.round((lessonsCompleted / totalLessons) * 100);
    
    // Update progress circle
    const progressFill = document.querySelector('.progress-circle .progress-fill');
    const percentText = document.querySelector('.progress-text .percent');
    
    if (progressFill && percentText) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (progressPercent / 100) * circumference;
        progressFill.style.strokeDashoffset = offset;
        percentText.textContent = `${progressPercent}%`;
    }
    
    // Update course card progress bars
    document.querySelectorAll('.progress-bar-fill').forEach(bar => {
        bar.style.width = `${progressPercent}%`;
    });
    
    document.querySelectorAll('.progress-percent').forEach(text => {
        text.textContent = `${progressPercent}%`;
    });
}

/**
 * Mark lesson as complete (placeholder for future implementation)
 * @param {string} lessonId - The ID of the completed lesson
 */
function markLessonComplete(lessonId) {
    // Store in localStorage for persistence
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    }
    
    // Update UI
    const totalLessons = 9;
    updateProgress(completedLessons.length, totalLessons);
}

/**
 * Load saved progress from localStorage
 */
function loadProgress() {
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    const totalLessons = 9;
    updateProgress(completedLessons.length, totalLessons);
}

// Load progress when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProgress);
} else {
    loadProgress();
}
