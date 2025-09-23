// Buy Now Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get modal elements
  const modal = document.getElementById('buyNowModal');
  const btn = document.querySelectorAll('.btn.buy-now');
  const closeBtn = document.querySelector('.close-modal');
  const form = document.getElementById('availabilityForm');
  const confirmation = document.getElementById('confirmationMessage');

  // Open modal when any Buy Now button is clicked
  btn.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'block';
      // Reset form and hide confirmation when opening
      form.style.display = 'block';
      confirmation.style.display = 'none';
      form.reset();
    });
  });

  // Close modal when X is clicked
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target == modal) {
      modal.style.display = 'none';
    }
  });

  // Form submission with FormSubmit
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // Create FormData for submission to FormSubmit
      const formData = new FormData(this);
      
      // Send to FormSubmit
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success - show confirmation message
        form.style.display = 'none';
        confirmation.style.display = 'block';
        confirmation.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <p>Thank you! We've received your inquiry and will contact you within 30 minutes.</p>
        `;
        
        // Close modal after 3 seconds
        setTimeout(function() {
          modal.style.display = 'none';
        }, 3000);
        
      } else {
        // Error from FormSubmit
        throw new Error('Form submission failed');
      }
      
    } catch (error) {
      // Show error message
      form.style.display = 'none';
      confirmation.style.display = 'block';
      confirmation.innerHTML = `
        <i class="fas fa-times-circle"></i>
        <p>Sorry, there was an error sending your message. Please try again or contact us directly.</p>
      `;
      
      // Keep error message visible until user closes manually
      console.error('Form submission error:', error);
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});
