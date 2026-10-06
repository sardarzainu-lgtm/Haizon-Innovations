// ===================================
// HAIZON INNOVATIONS - Xeven-style interactions
// Scroll reveals + simple hovers only (no infinite loops / 3D tilt / canvas)
// ===================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const throttle = (fn) => {
    let ticking = false;
    return (...args) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            fn(...args);
            ticking = false;
        });
    };
};

const LOGO_TOP = 'assets/images/logo.png';
const LOGO_SCROLLED = 'assets/images/logo1.jpg';

const initScrollHandlers = () => {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const aboutSection = document.getElementById('about');
    const statCards = document.querySelectorAll('.stat-card');
    const logoImg = navbar?.querySelector('.logo-img');
    let statsAnimated = false;
    let logoSrcChanged = false;

    const onScroll = throttle(() => {
        const scrollY = window.pageYOffset;
        const isScrolled = scrollY > 100;
        navbar?.classList.toggle('scrolled', isScrolled);
        backToTop?.classList.toggle('visible', scrollY > 300);

        if (logoImg) {
            if (isScrolled && !logoSrcChanged) {
                logoImg.src = LOGO_SCROLLED;
                logoSrcChanged = true;
            } else if (!isScrolled && logoSrcChanged) {
                logoImg.src = LOGO_TOP;
                logoSrcChanged = false;
            }
        }

        if (!statsAnimated && aboutSection && statCards.length) {
            const rect = aboutSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75) {
                statsAnimated = true;
                statCards.forEach((card, index) => {
                    setTimeout(() => {
                        const number = card.querySelector('.stat-number');
                        if (!number) return;
                        const finalValue = number.textContent;
                        if (/^\d+$/.test(finalValue)) {
                            animateNumber(number, 0, parseInt(finalValue, 10), 1500);
                        }
                    }, index * 150);
                });
            }
        }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
};

const animateNumber = (element, start, end, duration) => {
    const startTime = performance.now();
    const update = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        element.textContent = `${Math.floor(start + (end - start) * eased)}+`;
        if (progress < 1) requestAnimationFrame(update);
        else element.textContent = `${end}+`;
    };
    requestAnimationFrame(update);
};

const initNavbar = () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (!menuToggle || !navLinks) return;

    const setMenuOpen = (isActive) => {
        navLinks.classList.toggle('active', isActive);
        menuToggle.setAttribute('aria-expanded', String(isActive));
        document.body.classList.toggle('nav-menu-open', isActive);
        const spans = menuToggle.querySelectorAll('span');
        if (spans[0]) spans[0].style.transform = isActive ? 'rotate(45deg) translateY(9px)' : 'none';
        if (spans[1]) spans[1].style.opacity = isActive ? '0' : '1';
        if (spans[2]) spans[2].style.transform = isActive ? 'rotate(-45deg) translateY(-9px)' : 'none';
        if (!isActive) {
            navLinks.querySelectorAll('.nav-dropdown.open').forEach((item) => {
                item.classList.remove('open');
                const trigger = item.querySelector(':scope > a');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            });
            navLinks.scrollTop = 0;
        }
    };

    menuToggle.addEventListener('click', () => {
        setMenuOpen(!navLinks.classList.contains('active'));
    });

    navLinks.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
        const trigger = dropdown.querySelector(':scope > a');
        if (!trigger) return;

        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');

        trigger.addEventListener('click', (e) => {
            if (window.innerWidth > 768) return;
            e.preventDefault();
            e.stopPropagation();
            const willOpen = !dropdown.classList.contains('open');
            navLinks.querySelectorAll('.nav-dropdown.open').forEach((item) => {
                if (item !== dropdown) {
                    item.classList.remove('open');
                    const otherTrigger = item.querySelector(':scope > a');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                }
            });
            dropdown.classList.toggle('open', willOpen);
            trigger.setAttribute('aria-expanded', String(willOpen));
        });
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (link.closest('.nav-dropdown') && link.parentElement?.classList.contains('nav-dropdown')) {
                return;
            }
            setMenuOpen(false);
        });
    });
};

const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });
};

const initScrollReveal = () => {
    document.querySelectorAll('.scroll-reveal').forEach((el) => {
        if (prefersReducedMotion) {
            el.classList.add('revealed');
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(el);
    });
};

const initSectionReveals = () => {
    const excludeReveal = new Set([
        '.webdev-hero',
        '.webdev-hero-stable',
        '.footer',
        '.footer-stable'
    ]);

    const selectors = [
        '.features',
        '.services',
        '.automation-section',
        '.portfolio',
        '.testimonials',
        '.orbital-approach',
        '.why-haizon',
        '.about',
        '.contact',
        '.pricing',
        '.industries-section',
        '.webdev-services-carousel',
        '.webdev-features',
        '.webdev-platforms',
        '.webdev-process',
        '.webdev-faq'
    ];

    selectors.forEach((sel) => {
        if (excludeReveal.has(sel)) return;
        document.querySelectorAll(sel).forEach((section) => {
            if (section.closest('.webdev-hero-stable') || section.classList.contains('footer-stable')) return;
            section.classList.add('reveal-on-scroll');
            if (prefersReducedMotion) {
                section.classList.add('is-visible');
                return;
            }
        });
    });

    document.querySelectorAll('.webdev-hero-stable, .webdev-hero-premium, .footer-stable').forEach((el) => {
        el.classList.remove('reveal-on-scroll');
        el.classList.add('is-visible');
    });

    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
};

const initOptimizedHeroVideo = () => {
    const hero = document.getElementById('home');
    const video = document.getElementById('heroVideo');
    const background = document.getElementById('heroBackground');
    if (!hero || !video || !background) return;

    const source = video.querySelector('source[data-src]');
    const saveData = navigator.connection?.saveData === true;
    const reducedMotion = prefersReducedMotion;

    if (!source || saveData || reducedMotion) {
        background.classList.add('video-disabled');
        return;
    }

    let loaded = false;

    const loadVideo = () => {
        if (loaded) return;
        const url = source.getAttribute('data-src');
        if (!url) return;
        source.setAttribute('src', url);
        source.removeAttribute('data-src');
        video.load();
        loaded = true;
    };

    const playVideo = () => {
        loadVideo();
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise
                .then(() => background.classList.add('is-video-playing'))
                .catch(() => background.classList.remove('is-video-playing'));
        }
    };

    const pauseVideo = () => {
        video.pause();
        background.classList.remove('is-video-playing');
    };

    video.addEventListener('playing', () => background.classList.add('is-video-playing'));
    video.addEventListener('ended', () => video.play().catch(() => {}));

    const visibilityObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
                    playVideo();
                } else {
                    pauseVideo();
                }
            });
        },
        { threshold: [0, 0.25, 0.5] }
    );

    visibilityObserver.observe(hero);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseVideo();
        } else {
            const rect = hero.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                playVideo();
            }
        }
    });

    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            const rect = hero.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                loadVideo();
            }
        }, { timeout: 2000 });
    }
};

const initHeroFade = () => {
    document.querySelectorAll('.fade-up').forEach((element) => {
        if (prefersReducedMotion || element.closest('.webdev-hero-stable')) {
            element.classList.add('visible');
            return;
        }
        const delay = parseFloat(element.dataset.delay || 0) * 1000;
        setTimeout(() => element.classList.add('visible'), delay);
    });

    document.querySelectorAll('.webdev-hero-stable .webdev-hero-badge, .webdev-hero-stable .webdev-hero-title, .webdev-hero-stable .webdev-hero-description, .webdev-hero-stable .webdev-hero-cta').forEach((el) => {
        el.classList.add('visible');
    });
};

const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector('.form-submit');
        if (!submitButton) return;
        const originalHtml = submitButton.innerHTML;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        setTimeout(() => {
            submitButton.textContent = 'Message Received';
            submitButton.style.background = 'linear-gradient(135deg, #5D6D7E 0%, #D4A84B 100%)';
            contactForm.reset();
            setTimeout(() => {
                submitButton.innerHTML = originalHtml;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
        }, 1500);
    });
};

const initBackToTop = () => {
    document.getElementById('backToTop')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

const initTyping = () => {
    const element = document.querySelector('.typing-text');
    if (!element || prefersReducedMotion) return;

    const words = ['Web Applications', 'AI Models', 'The Future', 'Digital Solutions'];
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
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    };
    type();
};

const initStickyScroll = () => {
    const stickySlides = document.querySelectorAll('.sticky-slide');
    if (!stickySlides.length) return;

    const calculateOffset = () => {
        const vh = window.innerHeight;
        stickySlides.forEach((slide) => {
            slide.style.top = slide.offsetHeight > vh ? `${vh - slide.offsetHeight}px` : '0px';
        });
    };
    calculateOffset();
    window.addEventListener('resize', throttle(calculateOffset));
};

const initGalleryReveal = () => {
    const cards = document.querySelectorAll('.gallery-card');
    if (!cards.length || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const index = [...cards].indexOf(card);
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 80);
                    observer.unobserve(card);
                }
            });
        },
        { threshold: 0.15 }
    );

    cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(28px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.transitionDelay = `${i * 0.05}s`;
        observer.observe(card);
    });
};

const initAboutStats = () => {
    const statCards = document.querySelectorAll('.about-stat-card');
    if (!statCards.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const card = entry.target;
                const target = parseInt(card.dataset.count, 10) || 0;
                const counter = card.querySelector('.counter');
                if (!counter) return;

                let current = 0;
                const step = () => {
                    current += Math.ceil(target / 40);
                    if (current < target) {
                        counter.textContent = current;
                        setTimeout(step, 35);
                    } else {
                        counter.textContent = target;
                        card.classList.add('animated');
                    }
                };
                step();
                observer.unobserve(card);
            });
        },
        { threshold: 0.3 }
    );

    statCards.forEach((card) => observer.observe(card));
};

const initCircularTestimonials = () => {
    const carousel = document.getElementById('testimonialsCarousel');
    const contentArea = document.getElementById('testimonialContent');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('carouselDots');
    const section = document.getElementById('testimonials');

    if (!carousel || !contentArea || !prevBtn || !nextBtn) return;

    const testimonials = [
        { name: 'John Davis', designation: 'CEO, TechStart Inc.', quote: 'HAIZON INNOVATIONS transformed our business with their exceptional web development skills. The MERN stack application they built is fast, scalable, and exactly what we needed.' },
        { name: 'Sarah Chen', designation: 'CTO, DataFlow Solutions', quote: 'Their machine learning expertise is outstanding. The predictive analytics model they developed has improved our decision-making process by 40%.' },
        { name: 'Michael Rodriguez', designation: 'Product Manager, HealthTech Pro', quote: 'Professional, responsive, and incredibly talented. The UI/UX design they created for our app is beautiful and our users love it!' },
        { name: 'Emily Kim', designation: 'Director of AI, AutoVision Corp', quote: 'Working with HAIZON INNOVATIONS was a game-changer. Their deep learning solution for our computer vision needs exceeded all expectations.' },
        { name: 'David Park', designation: 'Founder, CloudBase Systems', quote: 'Exceptional full-stack development team. They delivered our SaaS platform on time and within budget. Highly recommended!' }
    ];

    let activeIndex = 0;
    let autoplayInterval = null;
    const images = carousel.querySelectorAll('.carousel-image');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    const total = testimonials.length;

    const updateImages = () => {
        const prev = (activeIndex - 1 + total) % total;
        const next = (activeIndex + 1) % total;
        images.forEach((img, i) => {
            img.classList.remove('active', 'prev', 'next');
            if (i === activeIndex) img.classList.add('active');
            else if (i === prev) img.classList.add('prev');
            else if (i === next) img.classList.add('next');
        });
    };

    const updateContent = () => {
        const t = testimonials[activeIndex];
        contentArea.style.opacity = '0';
        setTimeout(() => {
            contentArea.innerHTML = `
                <h3 class="client-name">${t.name}</h3>
                <p class="client-designation">${t.designation}</p>
                <p class="client-quote">${t.quote}</p>
            `;
            contentArea.style.opacity = '1';
        }, 180);
    };

    const updateCarousel = () => {
        updateImages();
        updateContent();
        dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
    };

    const goTo = (index) => {
        activeIndex = (index + total) % total;
        updateCarousel();
        resetAutoplay();
    };

    const stopAutoplay = () => {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = null;
    };

    const startAutoplay = () => {
        if (prefersReducedMotion) return;
        stopAutoplay();
        autoplayInterval = setInterval(() => goTo(activeIndex + 1), 6000);
    };

    const resetAutoplay = () => {
        stopAutoplay();
        startAutoplay();
    };

    nextBtn.addEventListener('click', () => goTo(activeIndex + 1));
    prevBtn.addEventListener('click', () => goTo(activeIndex - 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    contentArea.style.transition = 'opacity 0.25s ease';
    updateCarousel();

    const parent = carousel.closest('.testimonials') || carousel.parentElement;
    parent?.addEventListener('mouseenter', stopAutoplay);
    parent?.addEventListener('mouseleave', startAutoplay);

    if (section && !prefersReducedMotion) {
        const visibilityObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) startAutoplay();
                    else stopAutoplay();
                });
            },
            { threshold: 0.2 }
        );
        visibilityObserver.observe(section);
    } else {
        startAutoplay();
    }
};

const initOrbitalTimeline = () => {
    const orbitalNodes = document.getElementById('orbitalNodes');
    const infoCard = document.getElementById('orbitalInfoCard');
    if (!orbitalNodes) return;

    const nodes = orbitalNodes.querySelectorAll('.orbital-node');
    const nodeData = {
        1: { title: 'Discover & Analyze', step: 'Step 1', badge: 'COMPLETED', content: 'We begin by deeply analyzing your business goals, challenges, and target audience.', energy: 100 },
        2: { title: 'Strategy & Planning', step: 'Step 2', badge: 'COMPLETED', content: 'We translate ideas into structured strategies with user journeys and technology selection.', energy: 90 },
        3: { title: 'UI/UX & Prototyping', step: 'Step 3', badge: 'IN PROGRESS', content: 'Our design team creates wireframes, prototypes, and user-friendly interfaces.', energy: 60 },
        4: { title: 'Development & AI', step: 'Step 4', badge: 'PENDING', content: 'We develop robust applications with AI-powered features and clean architecture.', energy: 30 },
        5: { title: 'Launch & Growth', step: 'Step 5', badge: 'PENDING', content: 'Testing, deployment, and continuous support for long-term growth.', energy: 10 }
    };

    let activeNodeId = null;

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
        const badge = infoCard.querySelector('.info-card-badge');
        badge.style.color = '#0a0a0f';
        if (data.badge === 'COMPLETED') badge.style.background = '#D4A84B';
        else if (data.badge === 'IN PROGRESS') {
            badge.style.background = '#5D6D7E';
            badge.style.color = '#fff';
        } else {
            badge.style.background = 'rgba(255,255,255,0.2)';
            badge.style.color = '#fff';
        }
        infoCard.classList.add('visible');
    };

    nodes.forEach((node) => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            const nodeId = parseInt(node.dataset.id, 10);
            if (activeNodeId === nodeId) {
                activeNodeId = null;
                node.classList.remove('active');
                infoCard?.classList.remove('visible');
            } else {
                nodes.forEach((n) => n.classList.remove('active'));
                activeNodeId = nodeId;
                node.classList.add('active');
                showInfoCard(nodeId);
            }
        });
    });

    document.querySelector('.orbital-approach')?.addEventListener('click', (e) => {
        if (!e.target.closest('.orbital-node') && !e.target.closest('.orbital-info-card')) {
            activeNodeId = null;
            nodes.forEach((n) => n.classList.remove('active'));
            infoCard?.classList.remove('visible');
        }
    });
};

const initIndustriesShowcase = () => {
    const imagePreview = document.getElementById('industryImagePreview');
    const previewImg = document.getElementById('industryPreviewImg');
    const industryItems = document.querySelectorAll('.industry-item');

    if (!imagePreview || !previewImg || !industryItems.length || isTouchDevice) {
        if (imagePreview) imagePreview.style.display = 'none';
        return;
    }

    imagePreview.classList.add('industry-image-preview');

    industryItems.forEach((item) => {
        const imageUrl = item.getAttribute('data-image');
        if (!imageUrl) return;

        item.addEventListener('mouseenter', () => {
            previewImg.src = imageUrl;
            previewImg.alt = item.querySelector('.industry-item-title')?.textContent || '';
            imagePreview.classList.add('visible');
        });

        item.addEventListener('mousemove', (e) => {
            imagePreview.style.left = `${e.clientX + 16}px`;
            imagePreview.style.top = `${e.clientY - 80}px`;
        });

        item.addEventListener('mouseleave', () => {
            imagePreview.classList.remove('visible');
        });
    });
};

const initTouchActiveGroups = (selector, containerSelector) => {
    if (!isTouchDevice) return;
    const cards = document.querySelectorAll(selector);
    if (!cards.length) return;

    cards.forEach((card) => {
        card.addEventListener('touchstart', () => {
            cards.forEach((c) => c.classList.remove('touch-active'));
            card.classList.add('touch-active');
        }, { passive: true });
    });

    document.addEventListener('touchstart', (e) => {
        if (!e.target.closest(containerSelector)) {
            cards.forEach((c) => c.classList.remove('touch-active'));
        }
    }, { passive: true });
};

const initAutomationSection = () => {
    const section = document.getElementById('automation');
    if (!section) return;

    const panel = document.getElementById('automation-panel');
    const live = document.getElementById('automation-live');
    const tabs = Array.from(section.querySelectorAll('.automation-tab[role="tab"]'));
    const tablist = section.querySelector('.automation-tabs');
    const track = document.getElementById('automationCapTrack');
    const prevBtn = document.getElementById('automationCapPrev');
    const nextBtn = document.getElementById('automationCapNext');

    if (!panel || !tabs.length) return;

    const modeLabels = {
        overview: 'Showing overview: business systems connected to the AI automation engine.',
        chatbots: 'Showing chatbots flow: customer to AI assistant to knowledge to response.',
        rag: 'Showing RAG flow: documents to RAG engine to grounded AI response.',
        agents: 'Showing agents flow: AI agent using tools to decide and act.',
        workflows: 'Showing workflows flow: trigger through AI processing to result.',
        document: 'Showing document AI flow: files through OCR and extraction to systems.',
    };

    const setMode = (mode, { focusTab = false } = {}) => {
        const nextMode = modeLabels[mode] ? mode : 'overview';
        panel.dataset.mode = nextMode;
        panel.setAttribute('aria-labelledby', `automation-tab-${nextMode}`);

        section.querySelectorAll('[data-flow="overview"]').forEach((el) => {
            el.hidden = nextMode !== 'overview';
        });

        section.querySelectorAll('.automation-mode-flow').forEach((el) => {
            el.hidden = el.dataset.flow !== nextMode;
        });

        tabs.forEach((tab) => {
            const selected = tab.dataset.mode === nextMode;
            tab.setAttribute('aria-selected', selected ? 'true' : 'false');
            tab.tabIndex = selected ? 0 : -1;
            if (selected && focusTab) tab.focus();
        });

        if (live) live.textContent = modeLabels[nextMode];
    };

    setMode(panel.dataset.mode || 'overview');

    tablist?.addEventListener('click', (e) => {
        const tab = e.target.closest('.automation-tab[role="tab"]');
        if (!tab || !tablist.contains(tab)) return;
        setMode(tab.dataset.mode);
    });

    tablist?.addEventListener('keydown', (e) => {
        const currentIndex = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
        if (currentIndex < 0) return;

        let nextIndex = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
            nextIndex = 0;
        } else if (e.key === 'End') {
            nextIndex = tabs.length - 1;
        }

        if (nextIndex === null) return;
        e.preventDefault();
        setMode(tabs[nextIndex].dataset.mode, { focusTab: true });
    });

    if (!prefersReducedMotion) {
        const visibilityObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    section.classList.toggle('automation-section--active', entry.isIntersecting);
                });
            },
            { threshold: 0.2 }
        );
        visibilityObserver.observe(section);
    }

    if (track && prevBtn && nextBtn) {
        const scrollCapabilities = (direction) => {
            const amount = Math.min(track.clientWidth * 0.85, 300);
            track.scrollBy({ left: direction * amount, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        };

        prevBtn.addEventListener('click', () => scrollCapabilities(-1));
        nextBtn.addEventListener('click', () => scrollCapabilities(1));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initOptimizedHeroVideo();
    initHeroFade();
    initScrollHandlers();
    initNavbar();
    initSmoothScroll();
    initScrollReveal();
    initSectionReveals();
    initContactForm();
    initBackToTop();
    initTyping();
    initStickyScroll();
    initGalleryReveal();
    initAboutStats();
    initCircularTestimonials();
    initOrbitalTimeline();
    initIndustriesShowcase();
    initAutomationSection();
    initTouchActiveGroups('.display-card', '.stacked-cards');
    initTouchActiveGroups('.gallery-card', '.gallery-card');
    initTouchActiveGroups('.bounce-card', '.bounce-card');
});
