// Enhanced Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Theme Management
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-toggle-icon');
    const body = document.body;
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', currentTheme);
    
    // Update toggle icon based on current theme
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
    }
    
    // Initialize theme icon
    updateThemeIcon(currentTheme);
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add a subtle pulse animation to the toggle
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Loading Screen Management
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading time and hide loading screen
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }, 400);
    
    // Smooth Scrolling for Navigation
    function smoothScroll(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - 80; // Account for fixed header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        // Easing function
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Add smooth scrolling to experience section if link exists
    const experienceLink = document.querySelector('a[href="#experience"]');
    if (experienceLink) {
        experienceLink.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScroll('#experience');
        });
    }
    
    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe achievement items for scroll animations
    const achievementItems = document.querySelectorAll('.achievement-item');
    achievementItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Parallax Effect for Background Elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.footer-box');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${150 + scrolled * speed}px) translateX(-20px) rotate(-7deg)`;
        });
    });
    
    // Dynamic Typing Effect for Subtitle (if desired)
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        }
        typing();
    }
    
    // Add hover effects for achievement items
    achievementItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform += ' scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
    });
    
    // Keyboard navigation for theme toggle
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = diameter + 'px';
        circle.style.left = (event.clientX - rect.left - radius) + 'px';
        circle.style.top = (event.clientY - rect.top - radius) + 'px';
        circle.classList.add('ripple');
        
        const ripple = button.querySelector('.ripple');
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    // Apply ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Add CSS for ripple effect
    const rippleCSS = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = rippleCSS;
    document.head.appendChild(style);
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debounced scroll for performance
    const debouncedScroll = debounce(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.footer-box');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${150 + scrolled * speed}px) translateX(-20px) rotate(-7deg)`;
        });
    }, 10);
    
    window.addEventListener('scroll', debouncedScroll);
    
    // Add accessibility improvements
    document.addEventListener('keydown', function(e) {
        // Skip to main content with Tab + Enter
        if (e.key === 'Tab' && e.shiftKey === false) {
            const focusedElement = document.activeElement;
            if (focusedElement === document.body) {
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    mainContent.focus();
                }
            }
        }
    });
    
    console.log('🚀 Portfolio enhanced with modern features loaded successfully!');
}); 