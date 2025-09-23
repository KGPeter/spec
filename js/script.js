document.addEventListener('DOMContentLoaded', function () {
    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', function () {
            navbar.classList.toggle('active');
            mobileMenuBtn.innerHTML = navbar.classList.contains('active') ?
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // ===== Close mobile menu on link click =====
    const navLinks = document.querySelectorAll('.navbar ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navbar?.classList.contains('active')) {
                navbar.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // ===== FAQ Accordion =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = questionBtn?.querySelector('i');

        if (answer) {
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease';
        }

        if (questionBtn && answer) {
            questionBtn.addEventListener('click', () => {
                const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        const otherBtn = otherItem.querySelector('.faq-question');
                        if (otherAnswer) otherAnswer.style.maxHeight = '0';
                        if (otherIcon) {
                            otherIcon.classList.remove('fa-chevron-up');
                            otherIcon.classList.add('fa-chevron-down');
                        }
                        if (otherBtn) {
                            otherBtn.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                if (isOpen) {
                    answer.style.maxHeight = '0';
                    questionBtn.setAttribute('aria-expanded', 'false');
                    if (icon) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    questionBtn.setAttribute('aria-expanded', 'true');
                    if (icon) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                }
            });
        }
    });

    // ===== Counter Animation =====
    function animateCounters() {
        const counters = document.querySelectorAll('[data-target]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    const startTime = performance.now();

                    const animateCounter = (currentTime) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        const value = Math.floor(progress * target);

                        counter.textContent = value.toLocaleString();
                        counter.classList.toggle('counting', progress < 1);

                        if (progress < 1) {
                            requestAnimationFrame(animateCounter);
                        }
                    };

                    requestAnimationFrame(animateCounter);
                    observer.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });

        counters.forEach(counter => observer.observe(counter));
    }
    animateCounters();

    // ===== Contact Form =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {

            const formData = {
                name: this.elements['name'].value.trim(),
                email: this.elements['email'].value.trim(),
                service: this.elements['service'].value,
                message: this.elements['message'].value.trim()
            };

            if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill in all required fields');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

        });
    }

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (navbar?.classList.contains('active')) {
                    navbar.classList.remove('active');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Sticky Header =====
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.style.boxShadow = window.scrollY > 100 ?
                '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
        });
    }

    // ===== Accessibility: Keyboard Navigation for FAQ =====
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
});


