document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', function () {
            navbar.classList.toggle('active');
            mobileMenuBtn.innerHTML = navbar.classList.contains('active') ?
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

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


    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = {
                name: this.elements['name'].value.trim(),
                email: this.elements['email'].value.trim(),
                service: this.elements['service'].value,
                message: this.elements['message'].value.trim()
            };


            if (!formData.name || !formData.email || !formData.message || !formData.service) {
                showCustomPopup('Please fill in all required fields', 'error');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const submissionData = new FormData(this);
                
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: submissionData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showCustomPopup('Your message has been sent successfully! We will get back to you soon.', 'success');
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showCustomPopup('There was an error sending your message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }


    function showCustomPopup(message, type) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const popup = document.createElement('div');
        popup.className = `custom-popup popup-${type}`;
        popup.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            text-align: center;
            min-width: 300px;
            max-width: 90%;
            border-left: 5px solid ${type === 'success' ? '#4CAF50' : '#f44336'};
        `;
        
        const icon = type === 'success' ? '✅' : '❌';
        const title = type === 'success' ? 'Success!' : 'Error!';
        
        popup.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: ${type === 'success' ? '#4CAF50' : '#f44336'};">${icon} ${title}</h3>
            <p style="margin: 0 0 20px 0; line-height: 1.5;">${message}</p>
            <div class="popup-buttons">
                <button class="popup-ok" style="
                    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                ">OK</button>
            </div>
        `;
        

        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        

        const okButton = popup.querySelector('.popup-ok');
        okButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        const closePopup = function(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', closePopup);
            }
        };
        document.addEventListener('keydown', closePopup);
    }

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

    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.style.boxShadow = window.scrollY > 100 ?
                '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
        });
    }

    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
});

