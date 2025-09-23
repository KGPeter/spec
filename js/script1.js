// Buy Now Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Modal script loaded');
  
  // Get modal elements
  const modal = document.getElementById('buyNowModal');
  const btn = document.querySelectorAll('.buy-now-btn');
  const closeBtn = document.querySelector('.close-modal');
  const form = document.getElementById('availabilityForm');
  const confirmation = document.getElementById('confirmationMessage');

  console.log('Found elements:', { modal, buttons: btn.length, closeBtn, form, confirmation });

  // Open modal when any Buy Now button is clicked
  btn.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Buy Now button clicked');
      modal.style.display = 'block';
      
      // Set product name if available
      const productName = this.getAttribute('data-product');
      if (productName) {
        document.getElementById('productName').value = productName;
        console.log('Product set to:', productName);
      }
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
      // Log form data for debugging
      const formData = new FormData(this);
      console.log('Form data:', Object.fromEntries(formData));
      
      // Send to FormSubmit
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('FormSubmit response:', result);
        
        // Success - show confirmation message
        form.style.display = 'none';
        confirmation.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <p>Thank you! We've received your inquiry and will contact you within 30 minutes.</p>
        `;
        confirmation.style.display = 'block';
        
        // Close modal after 3 seconds
        setTimeout(function() {
          modal.style.display = 'none';
          resetForm();
        }, 3000);
        
      } else {
        const errorText = await response.text();
        console.error('FormSubmit error response:', errorText);
        throw new Error(`Form submission failed: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      // Show error message
      form.style.display = 'none';
      confirmation.innerHTML = `
        <i class="fas fa-times-circle"></i>
        <p>Sorry, there was an error. Please try again or contact us directly.</p>
        <button onclick="resetForm()" class="btn">Try Again</button>
      `;
      confirmation.style.display = 'block';
    }
  });

  // Function to reset form
  function resetForm() {
    form.style.display = 'block';
    confirmation.style.display = 'none';
    form.reset();
  }
});
