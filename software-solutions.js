// ===================================
// Software Solutions page
// ===================================

(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initSoftwareFaq = () => {
        const faqAccordion = document.getElementById('faqAccordion');
        if (!faqAccordion) return;

        const faqItems = faqAccordion.querySelectorAll('.faq-accordion-item');
        faqItems.forEach((item) => {
            const trigger = item.querySelector('.faq-accordion-trigger');
            if (!trigger) return;

            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                faqItems.forEach((otherItem) => {
                    otherItem.classList.remove('active');
                    const otherTrigger = otherItem.querySelector('.faq-accordion-trigger');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                });

                if (!isActive) {
                    item.classList.add('active');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });
        });
    };

    const initSoftwarePageMotion = () => {
        const revealTargets = document.querySelectorAll(
            '.software-section, .software-tech, .software-faq, .software-final-cta'
        );

        revealTargets.forEach((el) => {
            el.classList.add('software-reveal');
            if (reduceMotion) el.classList.add('is-visible');
        });

        if (reduceMotion) return;

        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
        );

        document.querySelectorAll('.software-reveal').forEach((el) => revealObserver.observe(el));

        const activeSections = document.querySelectorAll(
            '.software-platform, .software-erp-visual, .software-integrate, .software-architecture'
        );
        if (activeSections.length) {
            const activeObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        entry.target.classList.toggle('software-visual--active', entry.isIntersecting);
                    });
                },
                { threshold: 0.25 }
            );
            activeSections.forEach((el) => activeObserver.observe(el));
        }
    };

    const initSoftwareHero = () => {
        const hero = document.querySelector('.software-hero');
        if (!hero) return;

        const background = document.getElementById('heroBackground');
        const video = document.getElementById('heroVideo');
        if (background) background.classList.add('video-disabled');
        if (video) {
            video.hidden = true;
            video.removeAttribute('src');
        }

        if (reduceMotion) hero.classList.add('software-hero--static');
    };

    function initSoftwareSolutionsPage() {
        if (!document.body.classList.contains('software-page')) return;
        initSoftwareHero();
        initSoftwareFaq();
        initSoftwarePageMotion();
    }

    document.addEventListener('DOMContentLoaded', initSoftwareSolutionsPage);
})();
