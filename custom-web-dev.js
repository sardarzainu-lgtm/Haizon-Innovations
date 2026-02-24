// Custom Web Development Page JavaScript

// FAQ Accordion - Modern Design
document.addEventListener('DOMContentLoaded', () => {
    const faqAccordion = document.getElementById('faqAccordion');
    
    if (faqAccordion) {
        const faqItems = faqAccordion.querySelectorAll('.faq-accordion-item');
        
        faqItems.forEach(item => {
            const trigger = item.querySelector('.faq-accordion-trigger');
            
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                
                // Close all FAQ items (single accordion behavior)
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherTrigger = otherItem.querySelector('.faq-accordion-trigger');
                    if (otherTrigger) {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Open clicked item if it wasn't active (toggle behavior)
                if (!isActive) {
                    item.classList.add('active');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }
    
    // Legacy FAQ support (if old structure exists)
    const legacyFaqItems = document.querySelectorAll('.webdev-faq-item');
    
    legacyFaqItems.forEach(item => {
        const question = item.querySelector('.webdev-faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                legacyFaqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // Services Carousel
    initServicesCarousel();

    // Scroll reveal animations
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

    // Observe all scroll-reveal elements
    document.querySelectorAll('.webdev-feature-card, .webdev-process-step, .webdev-why-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
    
    // Animate carousel cards on scroll
    const carouselCards = document.querySelectorAll('.service-carousel-card');
    carouselCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
    });
    
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.service-carousel-card');
                cards.forEach((card) => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
                carouselObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    const carouselWrapper = document.querySelector('.services-carousel-wrapper');
    if (carouselWrapper) {
        carouselObserver.observe(carouselWrapper);
    }
});

// Services Carousel Functionality
function initServicesCarousel() {
    const carousel = document.getElementById('servicesCarousel');
    const track = document.getElementById('servicesTrack');
    const prevBtn = document.getElementById('servicesPrev');
    const nextBtn = document.getElementById('servicesNext');
    const dotsContainer = document.getElementById('servicesDots');
    
    if (!carousel || !track || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const cards = track.querySelectorAll('.service-carousel-card');
    if (!cards.length) return;
    
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let totalSlides = Math.ceil(cards.length / cardsPerView);
    
    // Drag/Swipe state
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragOffset = 0;
    let startTranslate = 0;
    
    // Get cards per view based on screen width
    function getCardsPerView() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    // Get card width including gap
    function getCardWidth() {
        if (!cards[0]) return 300;
        const cardStyle = window.getComputedStyle(cards[0]);
        const cardWidth = cards[0].offsetWidth;
        const gap = 16; // 1rem gap
        return cardWidth + gap;
    }
    
    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        totalSlides = Math.ceil(cards.length / cardsPerView);
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dots
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - 1;
    }
    
    // Get current translate value
    function getCurrentTranslate() {
        const cardWidth = getCardWidth();
        return -(currentIndex * cardsPerView * cardWidth);
    }
    
    // Set track position
    function setTrackPosition(translate, animate = true) {
        track.style.transition = animate ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
        track.style.transform = `translateX(${translate}px)`;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        setTrackPosition(getCurrentTranslate());
        updateDots();
        updateButtons();
    }
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        }
    });
    
    // ===== POINTER EVENTS (Works for both mouse and touch) =====
    carousel.addEventListener('pointerdown', handleDragStart);
    carousel.addEventListener('pointermove', handleDragMove);
    carousel.addEventListener('pointerup', handleDragEnd);
    carousel.addEventListener('pointerleave', handleDragEnd);
    carousel.addEventListener('pointercancel', handleDragEnd);
    
    // Fallback touch events for older browsers
    carousel.addEventListener('touchstart', handleDragStart, { passive: true });
    carousel.addEventListener('touchmove', handleDragMove, { passive: false });
    carousel.addEventListener('touchend', handleDragEnd);
    carousel.addEventListener('touchcancel', handleDragEnd);
    
    function handleDragStart(e) {
        // Ignore if clicking on navigation buttons or dots
        if (e.target.closest('.carousel-nav-btn') || e.target.closest('.carousel-dot')) {
            return;
        }
        
        isDragging = true;
        startX = getPositionX(e);
        startTranslate = getCurrentTranslate();
        dragOffset = 0;
        
        // Remove transition during drag
        track.style.transition = 'none';
        carousel.style.cursor = 'grabbing';
        
        // Capture pointer for better tracking
        if (e.type === 'pointerdown') {
            carousel.setPointerCapture(e.pointerId);
        }
        
        // Prevent default to stop text selection
        e.preventDefault();
    }
    
    function handleDragMove(e) {
        if (!isDragging) return;
        
        currentX = getPositionX(e);
        dragOffset = currentX - startX;
        
        // Apply drag with resistance at edges
        let newTranslate = startTranslate + dragOffset;
        const maxTranslate = 0;
        const minTranslate = -((totalSlides - 1) * cardsPerView * getCardWidth());
        
        // Add resistance when dragging past edges
        if (newTranslate > maxTranslate) {
            newTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.3;
        } else if (newTranslate < minTranslate) {
            newTranslate = minTranslate + (newTranslate - minTranslate) * 0.3;
        }
        
        setTrackPosition(newTranslate, false);
        
        // Prevent default behaviors
        e.preventDefault();
    }
    
    function handleDragEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        carousel.style.cursor = 'grab';
        
        // Release pointer capture
        if (e && e.type === 'pointerup' && e.pointerId) {
            try {
                carousel.releasePointerCapture(e.pointerId);
            } catch (err) {}
        }
        
        const cardWidth = getCardWidth();
        const threshold = cardWidth * 0.2; // 20% of card width to trigger slide
        
        // Determine direction and snap
        if (dragOffset < -threshold && currentIndex < totalSlides - 1) {
            // Swiped left - go next
            goToSlide(currentIndex + 1);
        } else if (dragOffset > threshold && currentIndex > 0) {
            // Swiped right - go previous
            goToSlide(currentIndex - 1);
        } else {
            // Snap back to current position
            goToSlide(currentIndex);
        }
        
        // Reset drag offset after a small delay to prevent click
        setTimeout(() => {
            dragOffset = 0;
        }, 10);
    }
    
    function getPositionX(e) {
        // Pointer events (works for both mouse and touch)
        if (e.type.includes('pointer')) {
            return e.clientX;
        }
        // Touch events
        if (e.touches && e.touches[0]) {
            return e.touches[0].clientX;
        }
        // Mouse events fallback
        return e.clientX || e.pageX;
    }
    
    // Prevent click on links/buttons during drag
    let wasDragging = false;
    carousel.addEventListener('pointerdown', () => { wasDragging = false; });
    carousel.addEventListener('pointermove', () => { if (isDragging) wasDragging = true; });
    carousel.addEventListener('click', (e) => {
        if (wasDragging) {
            e.preventDefault();
            e.stopPropagation();
            wasDragging = false;
        }
    }, true);
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = 0;
                createDots();
                goToSlide(0);
            } else {
                // Just update position
                setTrackPosition(getCurrentTranslate());
            }
        }, 250);
    });
    
    // Keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentIndex > 0) goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
        }
    });
    
    // Initialize
    createDots();
    updateButtons();
    carousel.style.cursor = 'grab';
}

// Hero Section Fade-Up Animations
function initHeroAnimations() {
    const fadeUpElements = document.querySelectorAll('.webdev-hero .fade-up');
    
    if (fadeUpElements.length === 0) return;
    
    // Use Intersection Observer for initial visibility
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class with delay based on data-delay attribute
                const element = entry.target;
                const delay = parseFloat(element.dataset.delay || 0) * 1000;
                
                setTimeout(() => {
                    element.classList.add('visible');
                }, delay);
                
                // Stop observing once visible
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all fade-up elements
    fadeUpElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize hero animations on DOM ready
document.addEventListener('DOMContentLoaded', initHeroAnimations);

