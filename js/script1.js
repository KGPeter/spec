document.addEventListener('DOMContentLoaded', function() {
    // ===== Modal Functionality =====
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
            productNameInput.value = productName; // set hidden product input
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

    // ===== Custom Popup Function =====
    function showCustomPopup(message, type) {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
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
            <h3 style="margin:0 0 15px 0;color:${type==='success'?'#4CAF50':'#f44336'}">${icon} ${title}</h3>
            <p style="margin:0 0 20px 0;line-height:1.5">${message}</p>
            <button class="popup-ok" style="
                background:${type==='success'?'#4CAF50':'#f44336'};
                color:white;
                border:none;
                padding:10px 20px;
                border-radius:5px;
                cursor:pointer;
                font-size:16px;
            ">OK</button>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        const okButton = popup.querySelector('.popup-ok');
        okButton.addEventListener('click', () => document.body.removeChild(overlay));

        overlay.addEventListener('click', e => { if (e.target === overlay) document.body.removeChild(overlay); });

        const closePopup = e => { if (e.key === 'Escape') { document.body.removeChild(overlay); document.removeEventListener('keydown', closePopup); } };
        document.addEventListener('keydown', closePopup);
    }
});
