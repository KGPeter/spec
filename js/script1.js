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

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Here you would normally send the data to your server
    // For demo purposes, we'll just show the confirmation
    form.style.display = 'none';
    confirmation.style.display = 'block';
    
    // Close modal after 3 seconds
    setTimeout(function() {
      modal.style.display = 'none';
    }, 3000);
  });
});
