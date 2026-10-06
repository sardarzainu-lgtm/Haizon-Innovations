// ===================================
// AI & Business Automation page
// ===================================

(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initAutomationFaq = () => {
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

    const initAutomationPageMotion = () => {
        const ecosystem = document.getElementById('ecosystem');
        if (ecosystem && !reduceMotion) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        ecosystem.classList.toggle('automation-section--active', entry.isIntersecting);
                    });
                },
                { threshold: 0.2 }
            );
            observer.observe(ecosystem);
        }

        const revealTargets = document.querySelectorAll(
            '.apage-why, .apage-capability, .apage-process, .apage-tech, .apage-final-cta, .apage-faq'
        );

        revealTargets.forEach((el) => {
            el.classList.add('apage-reveal');
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

        document.querySelectorAll('.apage-reveal').forEach((el) => revealObserver.observe(el));
    };

    const initAutomationHero = () => {
        const hero = document.querySelector('.apage-hero');
        if (!hero) return;

        const background = document.getElementById('heroBackground');
        const video = document.getElementById('heroVideo');
        if (background) background.classList.add('video-disabled');
        if (video) {
            video.hidden = true;
            video.removeAttribute('src');
        }

        if (reduceMotion) hero.classList.add('apage-hero--static');
    };

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.body.classList.contains('page-automation')) return;
        initAutomationHero();
        initAutomationFaq();
        initAutomationPageMotion();
    });
})();
