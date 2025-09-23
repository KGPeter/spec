// Buy Now Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Modal script loaded');
  
  // Get modal elements
  const modal = document.getElementById('buyNowModal');
  const btn = document.querySelectorAll('.buy-now'); // Fixed class name
  const closeBtn = document.querySelector('.close-modal');
  const form = document.getElementById('availabilityForm');
  const confirmation = document.getElementById('confirmationMessage');

  console.log('Found elements:', { modal, buttons: btn.length, closeBtn, form, confirmation });

  // Open modal when any Buy Now button is clicked
  btn.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Buy Now button clicked');
      
      // Set product name from the product card
      const productName = this.closest('.product-card').querySelector('h3').textContent;
      if (productName) {
        document.getElementById('productName').value = productName;
        console.log('Product set to:', productName);
      }
      
      modal.style.display = 'block';
    });
  });

  // Close modal when X is clicked
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      resetForm();
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target == modal) {
      modal.style.display = 'none';
      resetForm();
    }
  });

  // Form submission with FormSubmit
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Form submitted');
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // Send to FormSubmit
      const response = await fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success - show confirmation message
        form.style.display = 'none';
        confirmation.innerHTML = `
          <i class="fas fa-check-circle" style="font-size: 48px; color: green; margin-bottom: 20px;"></i>
          <p style="font-size: 18px; text-align: center;">Thank you! We've received your inquiry and will contact you within 30 minutes.</p>
        `;
        confirmation.style.display = 'block';
        
        // Close modal after 3 seconds
        setTimeout(function() {
          modal.style.display = 'none';
          resetForm();
        }, 3000);
        
      } else {
        throw new Error(`Form submission failed: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      // Show error message
      form.style.display = 'none';
      confirmation.innerHTML = `
        <i class="fas fa-times-circle" style="font-size: 48px; color: red; margin-bottom: 20px;"></i>
        <p style="font-size: 18px; text-align: center;">Sorry, there was an error. Please try again or contact us directly.</p>
        <button onclick="resetForm()" class="btn" style="margin-top: 20px;">Try Again</button>
      `;
      confirmation.style.display = 'block';
    }
  });

  // Function to reset form
  function resetForm() {
    form.reset();
    form.style.display = 'block';
    confirmation.style.display = 'none';
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Check Availability';
  }
});
