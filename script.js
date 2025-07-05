// Complete Enhanced JavaScript for Azeez's Website with Mobile Optimizations & Arrow Overlap Fix

// Enhanced hero carousel functionality
let currentHeroSlideIndex = 0;
const totalHeroSlides = 4;
let heroAutoplayInterval;
const autoplayDuration = 6000; // 6 seconds per slide
let isReducedMotion = false;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;
let isDragging = false;

// Enhanced mobile detection
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// Enhanced viewport height calculation for mobile browsers
function setViewportHeight() {
    // Get the viewport height and multiply by 1% to get a value for 1vh
    const vh = window.innerHeight * 0.01;
    // Set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Also handle iOS Safari's dynamic viewport
    if (window.visualViewport) {
        const visualVh = window.visualViewport.height * 0.01;
        document.documentElement.style.setProperty('--visual-vh', `${visualVh}px`);
    }
}

// Debounced resize handler for better performance
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

// Initialize reduced motion preference
function initReducedMotion() {
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// DYNAMIC ARROW POSITIONING TO PREVENT TEXT OVERLAP
function adjustArrowPosition() {
    const heroContent = document.querySelector('.hero-content');
    const heroText = document.querySelector('.hero-text');
    const prevArrow = document.querySelector('.hero-nav.prev');
    const nextArrow = document.querySelector('.hero-nav.next');
    
    if (!heroContent || !heroText || !prevArrow || !nextArrow) return;
    
    const screenWidth = window.innerWidth;
    const textWidth = heroText.offsetWidth;
    const contentPadding = parseInt(getComputedStyle(heroContent).paddingLeft);
    
    // Calculate safe arrow position
    const safeDistance = Math.max(15, (screenWidth - textWidth) / 4);
    
    if (screenWidth <= 768) {
        // Adjust arrow position based on content width
        prevArrow.style.left = Math.min(safeDistance, 25) + 'px';
        nextArrow.style.right = Math.min(safeDistance, 25) + 'px';
        
        // Hide arrows if screen is too narrow
        if (screenWidth <= 400 || textWidth > screenWidth * 0.8) {
            prevArrow.style.display = 'none';
            nextArrow.style.display = 'none';
            
            // Enhance dot navigation when arrows are hidden
            enhanceDotNavigation();
        } else {
            prevArrow.style.display = 'flex';
            nextArrow.style.display = 'flex';
        }
    } else {
        // Reset to default positions on larger screens
        prevArrow.style.left = '';
        nextArrow.style.right = '';
        prevArrow.style.display = 'flex';
        nextArrow.style.display = 'flex';
    }
}

function enhanceDotNavigation() {
    const dots = document.querySelectorAll('.hero-dot');
    dots.forEach(dot => {
        dot.style.transform = 'scale(1.2)';
        dot.style.minWidth = '55px';
        dot.style.minHeight = '55px';
        dot.style.background = 'rgba(255, 255, 255, 0.9)';
        dot.style.border = '3px solid rgba(255, 255, 255, 0.7)';
    });
}

// Smart arrow management based on slide content
function manageArrowsForSlide(slideIndex) {
    const slides = document.querySelectorAll('.hero-slide');
    const currentSlide = slides[slideIndex];
    const prevArrow = document.querySelector('.hero-nav.prev');
    const nextArrow = document.querySelector('.hero-nav.next');
    
    if (!currentSlide || !prevArrow || !nextArrow) return;
    
    const slideText = currentSlide.querySelector('.hero-text h1');
    const screenWidth = window.innerWidth;
    
    if (slideText && screenWidth <= 480) {
        const textLength = slideText.textContent.length;
        
        // Reduce arrow visibility for slides with long titles on small screens
        if (textLength > 25) {
            prevArrow.style.opacity = '0.3';
            nextArrow.style.opacity = '0.3';
            prevArrow.style.pointerEvents = 'none';
            nextArrow.style.pointerEvents = 'none';
        } else {
            prevArrow.style.opacity = '0.8';
            nextArrow.style.opacity = '0.8';
            prevArrow.style.pointerEvents = 'auto';
            nextArrow.style.pointerEvents = 'auto';
        }
    }
}

// Enhanced touch area for better mobile interaction
function createTouchAreas() {
    const heroCarousel = document.querySelector('.hero-carousel');
    if (!heroCarousel) return;
    
    // Remove existing touch areas to prevent duplicates
    const existingTouchAreas = heroCarousel.querySelectorAll('.touch-area');
    existingTouchAreas.forEach(area => area.remove());
    
    // Create invisible touch areas on sides for navigation
    const leftTouchArea = document.createElement('div');
    const rightTouchArea = document.createElement('div');
    
    leftTouchArea.className = 'touch-area';
    rightTouchArea.className = 'touch-area';
    
    const touchAreaStyle = `
        position: absolute;
        top: 20%;
        width: 60px;
        height: 60%;
        z-index: 5;
        background: transparent;
        cursor: pointer;
    `;
    
    leftTouchArea.style.cssText = touchAreaStyle + 'left: 0;';
    rightTouchArea.style.cssText = touchAreaStyle + 'right: 0;';
    
    leftTouchArea.addEventListener('click', () => changeHeroSlide(-1));
    rightTouchArea.addEventListener('click', () => changeHeroSlide(1));
    
    // Only add touch areas if arrows are hidden
    if (window.innerWidth <= 400) {
        heroCarousel.appendChild(leftTouchArea);
        heroCarousel.appendChild(rightTouchArea);
    }
}

function changeHeroSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    if (!slides.length) return;
    
    // Remove active class from current slide and dot
    slides[currentHeroSlideIndex].classList.remove('active');
    if (dots[currentHeroSlideIndex]) {
        dots[currentHeroSlideIndex].classList.remove('active');
        dots[currentHeroSlideIndex].setAttribute('aria-selected', 'false');
    }
    
    // Calculate next slide index
    currentHeroSlideIndex += direction;
    
    if (currentHeroSlideIndex >= totalHeroSlides) {
        currentHeroSlideIndex = 0;
    } else if (currentHeroSlideIndex < 0) {
        currentHeroSlideIndex = totalHeroSlides - 1;
    }
    
    // Add active class to new slide and dot
    slides[currentHeroSlideIndex].classList.add('active');
    if (dots[currentHeroSlideIndex]) {
        dots[currentHeroSlideIndex].classList.add('active');
        dots[currentHeroSlideIndex].setAttribute('aria-selected', 'true');
    }
    
    // Update progress bar
    updateHeroProgress();
    
    // Reset autoplay
    resetHeroAutoplay();
    
    // Announce slide change for screen readers
    announceSlideChange(currentHeroSlideIndex + 1);
    
    // Manage arrows for current slide
    manageArrowsForSlide(currentHeroSlideIndex);
}

function currentHeroSlide(slideIndex) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    if (!slides.length) return;
    
    // Remove active class from all slides and dots
    slides[currentHeroSlideIndex].classList.remove('active');
    if (dots[currentHeroSlideIndex]) {
        dots[currentHeroSlideIndex].classList.remove('active');
        dots[currentHeroSlideIndex].setAttribute('aria-selected', 'false');
    }
    
    // Set new slide index
    currentHeroSlideIndex = slideIndex - 1;
    
    // Add active class to new slide and dot
    slides[currentHeroSlideIndex].classList.add('active');
    if (dots[currentHeroSlideIndex]) {
        dots[currentHeroSlideIndex].classList.add('active');
        dots[currentHeroSlideIndex].setAttribute('aria-selected', 'true');
    }
    
    // Update progress bar
    updateHeroProgress();
    
    // Reset autoplay
    resetHeroAutoplay();
    
    // Announce slide change for screen readers
    announceSlideChange(slideIndex);
    
    // Manage arrows for current slide
    manageArrowsForSlide(currentHeroSlideIndex);
}

function updateHeroProgress() {
    const progressBar = document.querySelector('.hero-progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        // Small delay to ensure smooth animation
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 50);
    }
}

function announceSlideChange(slideNumber) {
    const announcement = `Slide ${slideNumber} of ${totalHeroSlides}`;
    const announcer = document.getElementById('slide-announcer');
    if (announcer) {
        announcer.textContent = announcement;
    }
}

function autoplayHeroSlides() {
    if (!isReducedMotion) {
        changeHeroSlide(1);
    }
}

function startHeroAutoplay() {
    if (!isReducedMotion) {
        heroAutoplayInterval = setInterval(autoplayHeroSlides, autoplayDuration);
        updateHeroProgress();
    }
}

function stopHeroAutoplay() {
    clearInterval(heroAutoplayInterval);
    const progressBar = document.querySelector('.hero-progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
}

function resetHeroAutoplay() {
    stopHeroAutoplay();
    startHeroAutoplay();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-links');
    const menuBtn = document.querySelector('.menu-toggle');
    
    if (navMenu && menuBtn) {
        const isExpanded = navMenu.classList.contains('active');
        
        navMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        
        // Focus management
        if (!isExpanded) {
            // Menu opened - focus first menu item
            const firstMenuItem = navMenu.querySelector('a');
            if (firstMenuItem) {
                setTimeout(() => firstMenuItem.focus(), 100);
            }
        }
    }
}

// Enhanced accessibility features
function initAccessibility() {
    // Create live region for announcements
    const announcer = document.createElement('div');
    announcer.id = 'slide-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
}

// Enhanced keyboard navigation
function initEnhancedKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.hero-carousel') || document.activeElement.closest('.hero-carousel')) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    changeHeroSlide(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    changeHeroSlide(1);
                    break;
                case 'Home':
                    e.preventDefault();
                    currentHeroSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    currentHeroSlide(totalHeroSlides);
                    break;
                case 'Escape':
                    e.preventDefault();
                    stopHeroAutoplay();
                    break;
                case ' ':
                case 'Enter':
                    if (e.target.classList.contains('hero-dot')) {
                        e.preventDefault();
                        const index = Array.from(document.querySelectorAll('.hero-dot')).indexOf(e.target) + 1;
                        currentHeroSlide(index);
                    }
                    break;
            }
        }
    });
}

// Enhanced touch/swipe support for hero carousel
function initEnhancedTouchSupport() {
    const heroCarousel = document.querySelector('.hero-carousel');
    if (!heroCarousel) return;

    // Prevent default touch behaviors that interfere with carousel
    heroCarousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
        isDragging = false;
        
        // Stop autoplay when user starts touching
        stopHeroAutoplay();
    }, { passive: true });

    heroCarousel.addEventListener('touchmove', function(e) {
        // Detect if user is trying to scroll vertically vs horizontally
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        const deltaX = Math.abs(currentX - touchStartX);
        const deltaY = Math.abs(currentY - touchStartY);
        
        // If horizontal movement is dominant, prevent vertical scrolling
        if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault();
            isDragging = true;
        }
    }, { passive: false });

    heroCarousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        const touchDuration = Date.now() - touchStartTime;
        
        // Only process swipe if it was quick and primarily horizontal
        if (touchDuration < 500 && isDragging) {
            handleEnhancedSwipe();
        }
        
        // Restart autoplay after touch ends
        setTimeout(() => {
            resetHeroAutoplay();
        }, 1000);
    }, { passive: true });
}

function handleEnhancedSwipe() {
    const swipeThreshold = 50;
    const horizontalDistance = touchStartX - touchEndX;
    const verticalDistance = Math.abs(touchStartY - touchEndY);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(horizontalDistance) > swipeThreshold && Math.abs(horizontalDistance) > verticalDistance) {
        if (horizontalDistance > 0) {
            // Swipe left - next slide
            changeHeroSlide(1);
        } else {
            // Swipe right - previous slide
            changeHeroSlide(-1);
        }
    }
}

// Performance optimization for mobile
function optimizeForMobile() {
    // Reduce animations on low-powered devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
    }
    
    // Optimize scroll performance
    let ticking = false;
    function updateScrollElements() {
        // Your scroll-related updates here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Handle screen orientation changes
function handleOrientationChange() {
    // Wait for the orientation change to complete
    setTimeout(() => {
        setViewportHeight();
        adjustArrowPosition(); // Readjust arrows after orientation change
        createTouchAreas(); // Recreate touch areas if needed
        updateCarousel(); // Update certificates carousel if it exists
        
        // Recalculate hero layout
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            // Force a reflow to ensure proper layout
            heroContent.style.display = 'none';
            heroContent.offsetHeight; // Trigger reflow
            heroContent.style.display = '';
        }
        
        // Recheck arrow management for current slide
        manageArrowsForSlide(currentHeroSlideIndex);
    }, 200);
}

// Initialize all mobile enhancements
function initMobileEnhancements() {
    // Set initial viewport height
    setViewportHeight();
    
    // Enhanced resize handler
    const debouncedResize = debounce(() => {
        setViewportHeight();
        adjustArrowPosition();
        createTouchAreas();
        if (typeof updateCarousel === 'function') {
            updateCarousel();
        }
    }, 150);
    
    // Event listeners
    window.addEventListener('resize', debouncedResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    
    // Visual viewport API support for iOS Safari
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', debouncedResize, { passive: true });
    }
    
    // Initialize touch support
    initEnhancedTouchSupport();
    
    // Initialize enhanced keyboard navigation
    initEnhancedKeyboardNavigation();
    
    // Optimize for mobile devices
    if (isMobileDevice()) {
        optimizeForMobile();
    }
    
    // Fix iOS bounce scroll behavior for hero
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        heroCarousel.style.overscrollBehavior = 'none';
    }
    
    // Initial arrow position adjustment
    setTimeout(() => {
        adjustArrowPosition();
        createTouchAreas();
        manageArrowsForSlide(0); // Initial slide management
    }, 100);
}

// Stats animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target || stat.textContent);
        const suffix = stat.textContent.includes('+') ? '+' : '';
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + suffix;
        }, 30);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function observeElements() {
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Certificates carousel functionality
const certificates = [
    { title: "Advanced Manufacturing Process Analysis (Coursera, Aug 2019)", img: "images/Advanced Manufacturing Process Analysis.jpg", category: ["foresight", "systems"], skills: "Futures Thinking, Systems Thinking, Process Optimization, Manufacturing Analysis" },
    { title: "Advanced-Data-Cleaning-in-Python", img: "images/Advanced-Data-Cleaning-in-Python.jpg", category: ["data", "research", "ci"], skills: "Data Analysis, Strategy, Systems Thinking, Data Cleaning, Python Programming" },
    { title: "Advanced Psychology for Stress and Leadership", img: "images/Advanced Psychology for Stress and Leadership.jpg", category: ["leadership", "systems", "ci"], skills: "Psychology, Interpersonal Skills, Strategy, Systems Thinking, Organizational Behavior and Change Management" },
    { title: "Air Pollution - a Global Threat to our Health (Coursera, Jul 2019)", img: "images/pollution.jpg", category: ["ehs"], skills: "EHS, Environmental Health, Air Quality Management" },
    { title: "Analyzing Survey Data in R", img: "images/Analyzing Survey Data in R.jpg", category: ["data"], skills: "Data Analysis, Statistical Analysis, R Programming, Survey Methodology" },
    { title: "Animal Behavior and Welfare (Coursera, Oct 2019)", img: "images/Animal Behaviour and Welfare.jpg", category: ["ehs"], skills: "Animal Welfare, Behavioral Science, Environmental Health" },
    { title: "APIs and Web Scraping with Python Path (Dataquest.io, Dec 2021)", img: "images/APIS.jpg", category: ["data"], skills: "API Integration, Web Scraping, Python Programming, Data Collection" },
    { title: "Becoming A Recruitment And Selection Specialist", img: "images/Becoming A Recruitment And Selection Specialist.jpg", category: ["leadership"], skills: "Recruitment Strategies, Candidate Selection, Talent Acquisition, Interview Techniques" },
    { title: "Chinese for Beginners (Coursera, Jul 2019)", img: "images/chinese.jpg", category: ["other"], skills: "Basic Chinese Language, Cultural Awareness, Communication Skills" },
    { title: "Climatology - Meteorology of Climate", img: "images/Climatology - Meteorology of Climate.jpg", category: ["other"], skills: "Climatology, Meteorology, Climate Analysis, Weather Forecasting" },
    { title: "Consulting Business Mastery 2022", img: "images/Consulting Business Mastery 2022.jpg", category: ["other"], skills: "Business Consulting, Strategic Planning, Client Management, Problem Solving" },
    { title: "Data Analyst with Python", img: "images/DATA_ANALYST.jpg", category: ["data", "specialization"], skills: "Data Analysis, Python Programming, Data Visualization, Statistical Analysis" },
    { title: "Data Scientist with Python", img: "images/Data Scientist with Python certificate.jpg", category: ["data", "specialization"], skills: "Data Science, Machine Learning, Python Programming, Statistical Modeling" },
    { title: "Diversity At Workplace", img: "images/Diversity At Workplace.jpg", category: ["leadership"], skills: "Diversity At Workplace, Inclusion Strategies, Cultural Competency" },
    { title: "Ecology: Ecosystem Dynamics and Conservation (American Museum of Natural History, Oct 2024)", img: "images/Ecology- Ecosystem Dynamics and Conservation.jpg", category: ["ehs", "systems"], skills: "Conservation, Ecosystem Ecology, Environmental Management" },
    { title: "Entrepreneurship", img: "images/Entrepreneurship.jpg", category: ["leadership", "systems"], skills: "Entrepreneurship, Business Development, Innovation, Strategic Planning" },
    { title: "EMT Foundations (Coursera, Dec 2019)", img: "images/EMT FOUNDATIONS.jpg", category: ["ehs"], skills: "EHS, Emergency Medical Techniques, Patient Care" },
    { title: "Energy Production, Distribution & Safety Specialization (Coursera, Dec 2019)", img: "images/Energy Production, Distribution & Safety.jpg", category: ["specialization", "ehs", "systems"], skills: "EHS, Systems Thinking, Energy Management, Safety Protocols" },
    { title: "Food Safety and Risk Analysis (Coursera, Sep 2019)", img: "images/Food Safety＆Risk Analysis.jpg", category: ["ehs"], skills: "EHS, Food Safety, Risk Assessment" },
    { title: "Futures Thinking (Specialization) (Institute for the Future, Apr 2024)", img: "images/Futures Thinking.jpg", category: ["foresight", "specialization"], skills: "Scenario Planning, Foresight, Futures Thinking, Problem Solving, Strategic Forecasting, Risk Assessment, Leadership, Critical Thinking" }
];

let currentPage = 1;
let currentFilter = 'all';
let autoScrollInterval;

function createCertificateItem(cert) {
    const item = document.createElement('div');
    item.className = `carousel-item ${cert.category.join(' ')}`;
    item.innerHTML = `
        <a href="${cert.img}" data-lightbox="certificates" data-title="${cert.title}" data-skills="${cert.skills || 'No skills listed'}">
            <img src="${cert.img}" loading="lazy" alt="${cert.title} certificate" class="carousel-image">
        </a>
        <p>${cert.title}</p>
        <small>Skills: ${cert.skills || 'No specific skills listed'}</small>
    `;
    const img = item.querySelector('.carousel-image');
    img.onerror = function() {
        this.style.display = 'none';
        this.parentElement.insertAdjacentHTML('afterend', '<p class="error-message">Image not found</p>');
    };
    return item;
}

function filterItems(category) {
    currentFilter = category;
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    carousel.innerHTML = '';
    const filtered = certificates.filter(cert => category === 'all' || cert.category.includes(category));
    if (filtered.length === 0) {
        carousel.innerHTML = '<p class="error-message">No certificates found for this category.</p>';
        document.querySelector('.total-pages').textContent = 1;
        document.querySelector('.current-page').textContent = 1;
        document.querySelector('.prev-btn').disabled = true;
        document.querySelector('.next-btn').disabled = true;
        clearInterval(autoScrollInterval);
        return;
    }
    filtered.forEach(cert => carousel.appendChild(createCertificateItem(cert)));
    currentPage = 1;
    updateCarousel();
    startAutoScroll();
}

function updateCarousel() {
    const carousel = document.querySelector('.carousel');
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (!carousel || !carouselWrapper) return;

    const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
    if (items.length === 0) {
        document.querySelector('.total-pages').textContent = 1;
        document.querySelector('.current-page').textContent = 1;
        document.querySelector('.prev-btn').disabled = true;
        document.querySelector('.next-btn').disabled = true;
        carousel.style.transform = 'translateX(0)';
        clearInterval(autoScrollInterval);
        return;
    }

    const itemsPerPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    if (currentPage > totalPages) currentPage = 1;
    if (currentPage < 1) currentPage = totalPages;

    document.querySelector('.total-pages').textContent = totalPages;
    document.querySelector('.current-page').textContent = currentPage;

    const containerWidth = carouselWrapper.offsetWidth - 32;
    const gap = 40;
    const totalGaps = itemsPerPage > 1 ? (itemsPerPage - 1) * gap : 0;
    const itemWidth = (containerWidth - totalGaps) / itemsPerPage;
    const translateX = -((currentPage - 1) * (itemWidth + gap) * itemsPerPage);

    carousel.style.transform = `translateX(${translateX}px)`;
    document.querySelector('.prev-btn').disabled = false;
    document.querySelector('.next-btn').disabled = false;
}

function startAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(() => {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;
        
        const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
        const itemsPerPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
        const totalPages = Math.ceil(items.length / itemsPerPage);

        currentPage++;
        if (currentPage > totalPages) currentPage = 1;
        updateCarousel();
    }, 3000);
}

// Contact form handling
function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = encodeURIComponent(`Message from ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            );
            const mailtoLink = `mailto:azeezhamzat@yahoo.com?subject=${subject}&body=${body}`;

            window.open(mailtoLink, '_blank');
            contactForm.reset();
        });
    }
}

// Back to top functionality
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile enhancements first
    initMobileEnhancements();
    
    // Initialize reduced motion detection
    initReducedMotion();
    
    // Initialize accessibility features
    initAccessibility();
    
    // Initialize hero carousel if it exists
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        // Start hero carousel autoplay
        startHeroAutoplay();
        
        // Pause carousel on hover/focus
        heroCarousel.addEventListener('mouseenter', stopHeroAutoplay);
        heroCarousel.addEventListener('mouseleave', startHeroAutoplay);
        heroCarousel.addEventListener('focusin', stopHeroAutoplay);
        heroCarousel.addEventListener('focusout', startHeroAutoplay);
    }

    // Initialize certificates carousel
    const filterButtons = document.querySelectorAll('.filter-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterItems(button.getAttribute('data-filter'));
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const carousel = document.querySelector('.carousel');
                if (!carousel) return;
                
                const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
                const itemsPerPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
                const totalPages = Math.ceil(items.length / itemsPerPage);

                currentPage--;
                if (currentPage < 1) currentPage = totalPages;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const carousel = document.querySelector('.carousel');
                if (!carousel) return;
                
                const items = Array.from(carousel.children).filter(item => !item.classList.contains('error-message'));
                const itemsPerPage = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
                const totalPages = Math.ceil(items.length / itemsPerPage);

                currentPage++;
                if (currentPage > totalPages) currentPage = 1;
                updateCarousel();
            });
        }

        if (carouselWrapper) {
            carouselWrapper.addEventListener('mouseenter', () => {
                clearInterval(autoScrollInterval);
            });

            carouselWrapper.addEventListener('mouseleave', () => {
                startAutoScroll();
            });
        }

        // Initial load
        filterItems('all');
    }
    
    // Observe fade-in elements
    observeElements();
    
    // Trigger stats animation when section comes into view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // Initialize contact form
    handleContactForm();

    // Initialize back to top
    initBackToTop();
    
    // Body loaded class for smooth initial animation
    document.body.classList.add('loaded');

    // Initialize Simple Lightbox for certificates
    if (typeof SimpleLightbox !== 'undefined') {
        new SimpleLightbox('[data-lightbox="certificates"]', {
            captions: true,
            captionSelector: 'data-title',
            captionType: 'data',
            captionsData: 'title',
            captionPosition: 'bottom',
            captionDelay: 250
        });
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navMenu = document.querySelector('.nav-links');
    const menuBtn = document.querySelector('.menu-toggle');
    
    if (navMenu && menuBtn && !navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
    }
});

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu
        const navMenu = document.querySelector('.nav-links');
        const menuBtn = document.querySelector('.menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.focus();
        }
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-links');
            const menuBtn = document.querySelector('.menu-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Export functions to global scope for HTML onclick handlers
window.changeHeroSlide = changeHeroSlide;
window.currentHeroSlide = currentHeroSlide;
window.toggleMobileMenu = toggleMobileMenu;