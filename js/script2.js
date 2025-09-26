document.addEventListener('DOMContentLoaded', function() {
    // ===== Modal Elements =====
    const modal = document.getElementById('serviceModal');
    const inquiryButtons = document.querySelectorAll('.inquire-btn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('serviceInquiryForm');

    // ===== Navbar Elements =====
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    // ===== Open Modal on Inquire Now =====
    inquiryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceName = this.getAttribute('data-service');
            document.getElementById('serviceName').value = serviceName;
            openModal();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    // ===== Form Submission with FormSubmit =====
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: this.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showCustomPopup(
                        `Thank you! We'll contact you within 30 minutes about your ${formData.get('serviceName')} needs.`,
                        'success'
                    );
                    this.reset();
                    closeModal();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form error:', error);
                showCustomPopup("Couldn't send the inquiry. Please try again.", 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    function openModal() {
        modal.style.display = 'block';
        form.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // ===== Custom Popup =====
    function showCustomPopup(message, type) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10002;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        `;

        const popup = document.createElement('div');
        popup.className = `custom-popup popup-${type}`;
        popup.style.cssText = `
            background: #fff;
            padding: 25px 35px;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
            position: relative;
        `;

        const icon = type === 'success' ? '✅' : '❌';
        const color = type === 'success' ? '#4CAF50' : '#f44336';
        popup.innerHTML = `
            <h3 style="margin:0 0 15px 0; font-size: 22px; color:${color}">${icon} ${type === 'success' ? 'Success' : 'Error'}</h3>
            <p style="margin:0; font-size:16px; line-height:1.5; color:#333">${message}</p>
            <button class="popup-ok" style="
                margin-top:20px;
                padding:10px 20px;
                border:none;
                border-radius:5px;
                font-size:16px;
                cursor:pointer;
                color:#fff;
                background:${color};
            ">OK</button>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        popup.querySelector('.popup-ok').addEventListener('click', () => document.body.removeChild(overlay));
        overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });
        document.addEventListener('keydown', function escClose(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', escClose);
            }
        });
    }

    // ===== Mobile Menu Toggle =====
    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
            mobileMenuBtn.innerHTML = navbar.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    // ===== Close mobile menu on link click =====
    const navLinks = document.querySelectorAll('.navbar ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // ===== Sticky Header Shadow =====
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 100
                ? '0 2px 10px rgba(0,0,0,0.1)'
                : 'none';
        });
    }
});
