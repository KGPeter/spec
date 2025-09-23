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
            productNameInput.value = productName; // set hidden input
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

        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showCustomPopup('Your message has been sent successfully! We will get back to you soon.', 'success');
                this.reset();
                modal.style.display = 'none';
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showCustomPopup("Couldn't send the message. Please try again.", 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // ===== Custom Popup Function (Centered with Icon) =====
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
            <h3 style="margin:0 0 15px 0; font-size: 24px; color: ${color}">${icon} ${type === 'success' ? 'Success!' : 'Error!'}</h3>
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

        // Close on OK button
        const okBtn = popup.querySelector('.popup-ok');
        okBtn.addEventListener('click', () => document.body.removeChild(overlay));

        // Close on overlay click
        overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });

        // Close on ESC
        const escClose = e => { if (e.key === 'Escape') { document.body.removeChild(overlay); document.removeEventListener('keydown', escClose); } };
        document.addEventListener('keydown', escClose);
    }
});
