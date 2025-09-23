// ===== Buy Now Modal =====
function initBuyNowModal() {
    const modal = document.getElementById('buyNowModal');
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    const closeModal = document.querySelector('.close-modal');
    const form = document.getElementById('availabilityForm');
    const successMessage = document.getElementById('availabilitySuccess');
    const errorMessage = document.getElementById('availabilityError');

    // Function to close modal
    window.closeModal = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetModal();
    };

    // Function to reset modal to initial state
    function resetModal() {
        if (form) form.style.display = 'block';
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
        if (form) form.reset();
    }

    // Open modal when Buy Now buttons are clicked
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product') || 'the product';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Set product name in hidden field
            const productField = document.getElementById('productName');
            if (productField) {
                productField.value = productName;
            }
            
            resetModal();
        });
    });

    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Form submission
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('customerName').value.trim(),
                phone: document.getElementById('customerPhone').value.trim(),
                location: document.getElementById('customerLocation').value.trim(),
                message: document.getElementById('customerMessage').value.trim(),
                product: document.getElementById('productName').value
            };

            // Validation
            if (!formData.name || !formData.phone || !formData.location) {
                alert('Please fill in all required fields');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Create FormData for submission
                const submissionData = new FormData(this);
                
                // Send to FormSubmit
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: submissionData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success message
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Auto-close after 5 seconds
                    setTimeout(() => {
                        closeModal();
                    }, 5000);
                    
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                // Show error message
                form.style.display = 'none';
                errorMessage.style.display = 'block';
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Initialize the modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBuyNowModal();
});
