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
    
    // Read from the rendered UI so animation matches current progress state.
    const percentText = document.querySelector('.progress-text .percent');
    const progressPercent = parseInt(percentText?.textContent || '0', 10) || 0;
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
    
    // Update only the active/featured Programming 2 course card.
    const featuredCourseCard = document.querySelector('.course-card.featured');
    const featuredProgressBar = featuredCourseCard?.querySelector('.progress-bar-fill');
    const featuredProgressText = featuredCourseCard?.querySelector('.progress-percent');

    if (featuredProgressBar) {
        featuredProgressBar.style.width = `${progressPercent}%`;
    }

    if (featuredProgressText) {
        featuredProgressText.textContent = `${progressPercent}%`;
    }
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
    const defaultCompletedLessons = ['lesson1', 'lesson2', 'lesson3'];
    const savedProgress = JSON.parse(localStorage.getItem('completedLessons') || 'null');
    const completedLessons = Array.isArray(savedProgress) && savedProgress.length > 0
        ? savedProgress
        : defaultCompletedLessons;
    const totalLessons = 9;
    const isUsingDefaultProgress = !Array.isArray(savedProgress) || savedProgress.length === 0;
    const effectiveLessonsCompleted = isUsingDefaultProgress ? 3.5 : completedLessons.length;
    updateProgress(effectiveLessonsCompleted, totalLessons);
}

// Load progress when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProgress);
} else {
    loadProgress();
}
