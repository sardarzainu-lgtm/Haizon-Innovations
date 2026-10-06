// ===================================
// Data Science & Analytics page
// ===================================

(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initDataFaq = () => {
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

    const initDataPageMotion = () => {
        const revealTargets = document.querySelectorAll(
            '.data-section, .data-tech, .data-faq, .data-final-cta'
        );

        const visualTargets = document.querySelectorAll(
            '.data-chart, .data-dashboard, .data-pipeline, .data-viz-panel, .data-forecast-visual'
        );

        revealTargets.forEach((el) => {
            el.classList.add('data-reveal');
            if (reduceMotion) el.classList.add('is-visible');
        });

        if (reduceMotion) {
            visualTargets.forEach((el) => el.classList.add('data-visual--active'));
            return;
        }

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

        document.querySelectorAll('.data-reveal').forEach((el) => revealObserver.observe(el));

        if (visualTargets.length) {
            const activeObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('data-visual--active');
                            activeObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
            );
            visualTargets.forEach((el) => activeObserver.observe(el));
        }
    };

    const initDataHero = () => {
        const hero = document.querySelector('.data-hero');
        if (!hero) return;

        const background = document.getElementById('heroBackground');
        const video = document.getElementById('heroVideo');
        if (background) background.classList.add('video-disabled');
        if (video) {
            video.hidden = true;
            video.removeAttribute('src');
        }

        if (reduceMotion) hero.classList.add('data-hero--static');
    };

    function initDataSciencePage() {
        if (!document.body.classList.contains('data-page')) return;
        initDataHero();
        initDataFaq();
        initDataPageMotion();
    }

    document.addEventListener('DOMContentLoaded', initDataSciencePage);
})();
