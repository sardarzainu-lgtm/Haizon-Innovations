// ===================================
// Machine Learning / DL / NLP page
// ===================================

(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initMachineLearningFaq = () => {
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

    const initMachineLearningPageMotion = () => {
        const revealTargets = document.querySelectorAll(
            '.ml-section, .ml-tech, .ml-faq, .ml-final-cta'
        );

        revealTargets.forEach((el) => {
            el.classList.add('ml-reveal');
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

        document.querySelectorAll('.ml-reveal').forEach((el) => revealObserver.observe(el));

        const activeSections = document.querySelectorAll('.ml-pipeline, .ml-layers-card, .ml-flow-card, .ml-nlp-card');
        if (activeSections.length) {
            const activeObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        entry.target.classList.toggle('ml-visual--active', entry.isIntersecting);
                    });
                },
                { threshold: 0.25 }
            );
            activeSections.forEach((el) => activeObserver.observe(el));
        }
    };

    const initMachineLearningHero = () => {
        const hero = document.querySelector('.ml-hero');
        if (!hero) return;

        const background = document.getElementById('heroBackground');
        const video = document.getElementById('heroVideo');
        if (background) background.classList.add('video-disabled');
        if (video) {
            video.hidden = true;
            video.removeAttribute('src');
        }

        if (reduceMotion) hero.classList.add('ml-hero--static');
    };

    function initMachineLearningPage() {
        if (!document.body.classList.contains('page-ml')) return;
        initMachineLearningHero();
        initMachineLearningFaq();
        initMachineLearningPageMotion();
    }

    document.addEventListener('DOMContentLoaded', initMachineLearningPage);
})();
