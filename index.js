// ===================================
// HAIZON INNOVATIONS - Interactive Features
// ===================================

// Hero Section Animations
document.addEventListener('DOMContentLoaded', () => {
    // Fade up animations for hero content
    const fadeElements = document.querySelectorAll('.fade-up');
    
    // Trigger animations on load with proper delays
    fadeElements.forEach((element) => {
        const delay = parseFloat(element.dataset.delay || 0) * 1000;
        setTimeout(() => {
            element.classList.add('visible');
        }, delay);
    });
});

// Navbar scroll effect with dynamic background
const navbar = document.getElementById('navbar');
const heroSection = document.getElementById('home');
let lastScroll = 0;

const updateNavbar = () => {
    const currentScroll = window.pageYOffset;
    
    // Check if we've scrolled past the hero section
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
};

// Initial check
updateNavbar();

// Update on scroll
window.addEventListener('scroll', updateNavbar, { passive: true });

// Update on resize (in case hero section height changes)
window.addEventListener('resize', updateNavbar);

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);

    // Animate hamburger menu
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = isActive
        ? 'rotate(45deg) translateY(9px)'
        : 'none';
    spans[1].style.opacity = isActive ? '0' : '1';
    spans[2].style.transform = isActive
        ? 'rotate(-45deg) translateY(-9px)'
        : 'none';
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observe all scroll-reveal elements
document.querySelectorAll('.scroll-reveal').forEach(element => {
    observer.observe(element);
});

// Parallax effect for floating shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// Form submission handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    const submitButton = contactForm.querySelector('.form-submit');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        submitButton.textContent = '✓ Message Sent!';
        submitButton.style.background = 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)';

        // Reset form
        contactForm.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);

        // Show success message (you can customize this)
        console.log('Form submitted:', data);
    }, 1500);
});

// Add hover effect to feature cards
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Animate stats on scroll
const statCards = document.querySelectorAll('.stat-card');
let statsAnimated = false;

const animateStats = () => {
    if (statsAnimated) return;

    const aboutSection = document.getElementById('about');
    const rect = aboutSection.getBoundingClientRect();

    if (rect.top < window.innerHeight * 0.75) {
        statsAnimated = true;

        statCards.forEach((card, index) => {
            setTimeout(() => {
                const number = card.querySelector('.stat-number');
                const finalValue = number.textContent;

                // Only animate numbers (not percentages or text like "24/7")
                if (finalValue.match(/^\d+$/)) {
                    animateNumber(number, 0, parseInt(finalValue), 2000);
                } else {
                    // For non-numeric values, just fade in
                    number.style.opacity = '0';
                    setTimeout(() => {
                        number.style.transition = 'opacity 0.5s ease';
                        number.style.opacity = '1';
                    }, 100);
                }
            }, index * 200);
        });
    }
};

const animateNumber = (element, start, end, duration) => {
    const startTime = performance.now();

    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);

        element.textContent = current + '+';

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end + '+';
        }
    };

    requestAnimationFrame(update);
};

window.addEventListener('scroll', animateStats);

// Add dynamic cursor effect (optional enhancement)
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    // Only show on desktop
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Scale up on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .feature-card, .stat-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
};

// Initialize cursor effect
createCursorEffect();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Console message for developers
console.log('%c🚀 HAIZON INNOVATIONS', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #5D6D7E 0%, #D4A84B 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cBuilt with passion and cutting-edge technology', 'font-size: 14px; color: #5D6D7E;');

// ===================================
// New Interactive Features
// ===================================

// 1. Interactive Particle Background
const initParticles = () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) {
        // Canvas element doesn't exist, skip initialization
        return;
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(102, 126, 234, ${Math.random() * 0.5})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Mouse interaction
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect particles
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(102, 126, 234, ${1 - distance / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // React to mouse
            if (mouse.x) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 200) {
                    const angle = Math.atan2(dy, dx);
                    p.x += Math.cos(angle) * 1;
                    p.y += Math.sin(angle) * 1;
                }
            }
        });

        requestAnimationFrame(animate);
    };

    animate();
};

initParticles();

// 2. Typing Text Effect
const initTyping = () => {
    const element = document.querySelector('.typing-text');
    if (!element) {
        // Typing text element doesn't exist, skip initialization
        return;
    }

    const words = ["Web Applications", "AI Models", "The Future", "Digital Solutions"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    };

    type();
};

initTyping();

// 3. Back to Top Button
const initBackToTop = () => {
    const button = document.getElementById('backToTop');
    if (!button) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

initBackToTop();

// 4. 3D Tilt Effect
const initTilt = () => {
    const cards = document.querySelectorAll('.feature-card, .service-card, .pricing-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
};

initTilt();

// 5. Sticky Scroll Logic (Pricing & Services)
const initStickyScroll = () => {
    const stickySlides = document.querySelectorAll('.sticky-slide');

    if (stickySlides.length > 0) {
        const calculateOffset = () => {
            const viewportHeight = window.innerHeight;

            stickySlides.forEach(stickySlide => {
                const contentHeight = stickySlide.offsetHeight;

                // If content is taller than viewport, stick when bottom is visible
                // Otherwise, stick to top
                if (contentHeight > viewportHeight) {
                    const offset = viewportHeight - contentHeight;
                    stickySlide.style.top = `${offset}px`;
                } else {
                    stickySlide.style.top = '0px';
                }
            });
        };

        // Calculate initially and on resize
        calculateOffset();
        window.addEventListener('resize', calculateOffset);

        // Also recalculate after a short delay to ensure images/fonts are loaded
        setTimeout(calculateOffset, 500);
        setTimeout(calculateOffset, 2000);
    }
};

initStickyScroll();

// ===================================
// Premium Gallery with 3D Tilt & Generative Art
// ===================================

const initPremiumGallery = () => {
    const galleryCards = document.querySelectorAll('.gallery-card[data-tilt]');
    
    if (!galleryCards.length) return;
    
    galleryCards.forEach(card => {
        const canvas = card.querySelector('.card-canvas');
        let ctx, lines = [], animationId;
        let isHovered = false;
        
        // Initialize canvas
        if (canvas) {
            ctx = canvas.getContext('2d');
            canvas.width = 400;
            canvas.height = 400;
            
            // Line class for generative art
            class Line {
                constructor() {
                    this.reset();
                }
                
                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.speed = Math.random() * 0.8 + 0.2;
                    this.angle = Math.random() * Math.PI * 2;
                    this.length = Math.random() * 25 + 8;
                    this.hue = Math.random() * 60 + 250; // Purple to blue range
                }
                
                update() {
                    this.x += Math.cos(this.angle) * this.speed;
                    this.y += Math.sin(this.angle) * this.speed;
                    
                    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                        this.reset();
                    }
                }
                
                draw() {
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(
                        this.x - Math.cos(this.angle) * this.length,
                        this.y - Math.sin(this.angle) * this.length
                    );
                    ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${Math.random() * 0.4 + 0.1})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
            
            // Create lines
            for (let i = 0; i < 35; i++) {
                lines.push(new Line());
            }
            
            // Animation loop
            const animate = () => {
                if (isHovered) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    lines.forEach(line => {
                        line.update();
                        line.draw();
                    });
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                animationId = requestAnimationFrame(animate);
            };
            
            animate();
        }
        
        // 3D Tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const rotateX = y * -15;
            const rotateY = x * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    galleryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        card.style.transitionDelay = `${index * 0.1}s`;
        cardObserver.observe(card);
    });
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initPremiumGallery);

// ===================================
// About Section - Animated Stats Counter
// ===================================

const initAboutStats = () => {
    const statCards = document.querySelectorAll('.about-stat-card');
    
    if (!statCards.length) return;
    
    const animateCounter = (element, target, suffix = '') => {
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const counter = element.querySelector('.counter');
        if (!counter) return;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, stepTime);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const count = parseInt(card.dataset.count) || 0;
                
                // Small delay for staggered effect
                setTimeout(() => {
                    animateCounter(card, count);
                    card.classList.add('animated');
                }, 100);
                
                // Only animate once
                statsObserver.unobserve(card);
            }
        });
    }, observerOptions);
    
    statCards.forEach(card => {
        statsObserver.observe(card);
    });
    
    // Service items hover effect
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.service-icon-wrap');
            if (icon) {
                icon.style.transform = 'rotate(-5deg) scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.service-icon-wrap');
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1)';
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', initAboutStats);

// ===================================
// Testimonials - Premium Circular Carousel
// ===================================
const initCircularTestimonials = () => {
    const carousel = document.getElementById('testimonialsCarousel');
    const contentArea = document.getElementById('testimonialContent');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!carousel || !contentArea || !prevBtn || !nextBtn) return;
    
    // Testimonials data
    const testimonials = [
        {
            name: "John Davis",
            designation: "CEO, TechStart Inc.",
            quote: "HAIZON INNOVATIONS transformed our business with their exceptional web development skills. The MERN stack application they built is fast, scalable, and exactly what we needed."
        },
        {
            name: "Sarah Chen",
            designation: "CTO, DataFlow Solutions",
            quote: "Their machine learning expertise is outstanding. The predictive analytics model they developed has improved our decision-making process by 40%."
        },
        {
            name: "Michael Rodriguez",
            designation: "Product Manager, HealthTech Pro",
            quote: "Professional, responsive, and incredibly talented. The UI/UX design they created for our app is beautiful and our users love it!"
        },
        {
            name: "Emily Kim",
            designation: "Director of AI, AutoVision Corp",
            quote: "Working with HAIZON INNOVATIONS was a game-changer. Their deep learning solution for our computer vision needs exceeded all expectations."
        },
        {
            name: "David Park",
            designation: "Founder, CloudBase Systems",
            quote: "Exceptional full-stack development team. They delivered our SaaS platform on time and within budget. Highly recommended!"
        }
    ];
    
    let activeIndex = 0;
    let autoplayInterval;
    const images = carousel.querySelectorAll('.carousel-image');
    const dots = dotsContainer.querySelectorAll('.dot');
    const totalItems = testimonials.length;
    
    // Update images with 3D effect
    const updateImages = () => {
        const prevIndex = (activeIndex - 1 + totalItems) % totalItems;
        const nextIndex = (activeIndex + 1) % totalItems;
        
        images.forEach((img, index) => {
            img.classList.remove('active', 'prev', 'next');
            
            if (index === activeIndex) {
                img.classList.add('active');
            } else if (index === prevIndex) {
                img.classList.add('prev');
            } else if (index === nextIndex) {
                img.classList.add('next');
            }
        });
    };
    
    // Animate quote text word by word
    const animateQuote = (quote) => {
        const words = quote.split(' ');
        return words.map((word, i) => 
            `<span class="word" style="animation-delay: ${i * 0.03}s">${word}</span>`
        ).join(' ');
    };
    
    // Update content with animation
    const updateContent = () => {
        const testimonial = testimonials[activeIndex];
        
        // Fade out
        contentArea.style.opacity = '0';
        contentArea.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            contentArea.innerHTML = `
                <h3 class="client-name">${testimonial.name}</h3>
                <p class="client-designation">${testimonial.designation}</p>
                <p class="client-quote">${animateQuote(testimonial.quote)}</p>
            `;
            
            // Fade in
            contentArea.style.opacity = '1';
            contentArea.style.transform = 'translateY(0)';
        }, 200);
    };
    
    // Update dots
    const updateDots = () => {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    };
    
    // Update all
    const updateCarousel = () => {
        updateImages();
        updateContent();
        updateDots();
    };
    
    // Navigation handlers
    const goToNext = () => {
        activeIndex = (activeIndex + 1) % totalItems;
        updateCarousel();
        resetAutoplay();
    };
    
    const goToPrev = () => {
        activeIndex = (activeIndex - 1 + totalItems) % totalItems;
        updateCarousel();
        resetAutoplay();
    };
    
    const goToIndex = (index) => {
        activeIndex = index;
        updateCarousel();
        resetAutoplay();
    };
    
    // Autoplay
    const startAutoplay = () => {
        autoplayInterval = setInterval(goToNext, 5000);
    };
    
    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };
    
    // Event listeners
    nextBtn.addEventListener('click', goToNext);
    prevBtn.addEventListener('click', goToPrev);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToIndex(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const section = document.getElementById('testimonials');
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'ArrowRight') goToNext();
        }
    });
    
    // Add transition styles to content area
    contentArea.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Initialize
    updateCarousel();
    startAutoplay();
    
    // Pause autoplay on hover
    carousel.parentElement.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.parentElement.addEventListener('mouseleave', startAutoplay);
};

document.addEventListener('DOMContentLoaded', initCircularTestimonials);

// ===================================
// Strategic Approach - Orbital Timeline
// ===================================
const initOrbitalTimeline = () => {
    const orbitalNodes = document.getElementById('orbitalNodes');
    const infoCard = document.getElementById('orbitalInfoCard');
    const stepCards = document.querySelectorAll('.approach-step-card');
    
    if (!orbitalNodes) return;
    
    const nodes = orbitalNodes.querySelectorAll('.orbital-node');
    
    // Node data
    const nodeData = {
        1: {
            title: "Discover & Analyze",
            step: "Step 1",
            badge: "COMPLETED",
            content: "We begin by deeply analyzing your business goals, challenges, and target audience. Our team gathers insights and identifies opportunities.",
            energy: 100
        },
        2: {
            title: "Strategy & Planning",
            step: "Step 2",
            badge: "COMPLETED",
            content: "We translate ideas into structured strategies with user journeys, feature planning, and technology selection.",
            energy: 90
        },
        3: {
            title: "UI/UX & Prototyping",
            step: "Step 3",
            badge: "IN PROGRESS",
            content: "Our design team creates wireframes, prototypes, and user-friendly interfaces with modern design principles.",
            energy: 60
        },
        4: {
            title: "Development & AI",
            step: "Step 4",
            badge: "PENDING",
            content: "We develop robust applications with AI-powered features, clean architecture, and optimized performance.",
            energy: 30
        },
        5: {
            title: "Launch & Growth",
            step: "Step 5",
            badge: "PENDING",
            content: "Rigorous testing, deployment, and continuous support with scaling strategies for long-term growth.",
            energy: 10
        }
    };
    
    let activeNodeId = null;
    
    // Show info card
    const showInfoCard = (nodeId) => {
        if (!infoCard) return;
        
        const data = nodeData[nodeId];
        if (!data) return;
        
        infoCard.querySelector('.info-card-badge').textContent = data.badge;
        infoCard.querySelector('.info-card-step').textContent = data.step;
        infoCard.querySelector('.info-card-title').textContent = data.title;
        infoCard.querySelector('.info-card-content').textContent = data.content;
        infoCard.querySelector('.energy-fill').style.width = `${data.energy}%`;
        infoCard.querySelector('.energy-value').textContent = `${data.energy}%`;
        
        // Update badge color
        const badge = infoCard.querySelector('.info-card-badge');
        badge.style.color = '#0a0a0f';
        if (data.badge === 'COMPLETED') {
            badge.style.background = '#D4A84B';
        } else if (data.badge === 'IN PROGRESS') {
            badge.style.background = '#5D6D7E';
            badge.style.color = '#ffffff';
        } else {
            badge.style.background = 'rgba(255,255,255,0.2)';
            badge.style.color = '#ffffff';
        }
        
        infoCard.classList.add('visible');
    };
    
    // Hide info card
    const hideInfoCard = () => {
        if (infoCard) {
            infoCard.classList.remove('visible');
        }
    };
    
    // Node click handler
    nodes.forEach(node => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            const nodeId = parseInt(node.dataset.id);
            
            if (activeNodeId === nodeId) {
                // Deselect
                activeNodeId = null;
                node.classList.remove('active');
                hideInfoCard();
            } else {
                // Select new node
                nodes.forEach(n => n.classList.remove('active'));
                activeNodeId = nodeId;
                node.classList.add('active');
                showInfoCard(nodeId);
            }
        });
    });
    
    // Click outside to deselect
    document.querySelector('.orbital-approach')?.addEventListener('click', (e) => {
        if (!e.target.closest('.orbital-node') && !e.target.closest('.orbital-info-card')) {
            activeNodeId = null;
            nodes.forEach(n => n.classList.remove('active'));
            hideInfoCard();
        }
    });
    
    // Step cards hover sync
    stepCards.forEach(card => {
        const stepNum = parseInt(card.dataset.step);
        
        card.addEventListener('mouseenter', () => {
            nodes.forEach(node => {
                if (parseInt(node.dataset.id) === stepNum) {
                    node.classList.add('active');
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            if (activeNodeId !== stepNum) {
                nodes.forEach(node => {
                    if (parseInt(node.dataset.id) === stepNum) {
                        node.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Scroll reveal animation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger card reveal
                stepCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 300 + index * 100);
                });
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    const approachSection = document.querySelector('.orbital-approach');
    if (approachSection) {
        revealObserver.observe(approachSection);
    }
};

document.addEventListener('DOMContentLoaded', initOrbitalTimeline);

// ===================================
// Why HAIZON Section - Bouncy Cards
// ===================================
const initBouncyCards = () => {
    const bounceCards = document.querySelectorAll('.bounce-card');
    
    if (bounceCards.length === 0) return;
    
    // Scroll reveal animation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger card reveal
                bounceCards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(40px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100 + index * 100);
                });
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    const whySection = document.querySelector('.why-haizon');
    if (whySection) {
        revealObserver.observe(whySection);
    }
    
    // Enhanced hover effect with mouse tracking
    bounceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.98)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
};

document.addEventListener('DOMContentLoaded', initBouncyCards);

// ===================================
// Mobile Touch Support for Stacked Cards
// ===================================
const initMobileStackedCards = () => {
    const displayCards = document.querySelectorAll('.display-card');
    
    if (!displayCards.length) return;
    
    // Check if device is touch-enabled
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice) return;
    
    displayCards.forEach(card => {
        // Add active class on touch
        card.addEventListener('touchstart', (e) => {
            // Remove active from all cards first
            displayCards.forEach(c => c.classList.remove('touch-active'));
            // Add active to this card
            card.classList.add('touch-active');
        }, { passive: true });
        
        // Also handle click for hybrid devices
        card.addEventListener('click', (e) => {
            displayCards.forEach(c => c.classList.remove('touch-active'));
            card.classList.add('touch-active');
        });
    });
    
    // Remove active when tapping outside
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.stacked-cards')) {
            displayCards.forEach(c => c.classList.remove('touch-active'));
        }
    }, { passive: true });
};

document.addEventListener('DOMContentLoaded', initMobileStackedCards);

// ===================================
// Mobile Touch Support for Gallery Cards
// ===================================
const initMobileGalleryCards = () => {
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    if (!galleryCards.length) return;
    
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice) return;
    
    galleryCards.forEach(card => {
        card.addEventListener('touchstart', () => {
            galleryCards.forEach(c => c.classList.remove('touch-active'));
            card.classList.add('touch-active');
        }, { passive: true });
        
        card.addEventListener('click', () => {
            if (!card.classList.contains('touch-active')) {
                galleryCards.forEach(c => c.classList.remove('touch-active'));
                card.classList.add('touch-active');
            }
        });
    });
    
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.gallery-card')) {
            galleryCards.forEach(c => c.classList.remove('touch-active'));
        }
    }, { passive: true });
};

document.addEventListener('DOMContentLoaded', initMobileGalleryCards);

// ===================================
// Mobile Touch Support for Bounce Cards
// ===================================
const initMobileBounceCards = () => {
    const bounceCards = document.querySelectorAll('.bounce-card');
    
    if (!bounceCards.length) return;
    
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice) return;
    
    bounceCards.forEach(card => {
        card.addEventListener('touchstart', () => {
            bounceCards.forEach(c => c.classList.remove('touch-active'));
            card.classList.add('touch-active');
        }, { passive: true });
        
        card.addEventListener('click', () => {
            if (!card.classList.contains('touch-active')) {
                bounceCards.forEach(c => c.classList.remove('touch-active'));
                card.classList.add('touch-active');
            }
        });
    });
    
    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest('.bounce-card')) {
            bounceCards.forEach(c => c.classList.remove('touch-active'));
        }
    }, { passive: true });
};

document.addEventListener('DOMContentLoaded', initMobileBounceCards);
