document.addEventListener('DOMContentLoaded', function() {

    // ===== Modal Elements =====
    const modal = document.getElementById('buyNowModal');
    const modalClose = modal.querySelector('.close-modal');
    const availabilityForm = document.getElementById('availabilityForm');
    const productNameInput = document.getElementById('productName');

    // Open modal on "Buy Now" click
    document.querySelectorAll('.buy-now').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            productNameInput.value = productName;
            modal.style.display = 'flex';
        });
    });

    // Close modal
    modalClose.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // ===== Form Submission =====
    availabilityForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Hide any previous messages
        hideMessages();

        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showMessage('confirmation-message', 'Your message has been sent successfully!', 'success');
                this.reset();
                setTimeout(() => modal.style.display = 'none', 2000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('error-message', "Couldn't send the message. Please try again.", 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // ===== Message Functions with Icons =====
    function showMessage(typeClass, message, type) {
        const msgEl = document.querySelector(`.${typeClass}`);
        if (!msgEl) return;

        // Use icons
        const icon = type === 'success' ? '✅' : '❌';
        msgEl.innerHTML = `<span style="font-size:24px;margin-right:8px">${icon}</span>${message}`;
        msgEl.style.display = 'block';

        setTimeout(() => msgEl.style.display = 'none', 4000);
    }

    function hideMessages() {
        document.querySelectorAll('.confirmation-message, .error-message').forEach(el => el.style.display = 'none');
    }
});
