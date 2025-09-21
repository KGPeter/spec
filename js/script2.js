document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const modal = document.getElementById('serviceModal');
    const inquiryButtons = document.querySelectorAll('.inquire-btn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('serviceInquiryForm');
    const confirmation = document.getElementById('confirmationMessage');
    const confirmedService = document.getElementById('confirmedService');
    
    // Open modal when Inquire Now is clicked
    inquiryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceName = this.getAttribute('data-service');
            document.getElementById('serviceName').value = serviceName;
            openModal();
        });
    });
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', closeModal);
    
    // Close when clicking outside modal
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
    
    // Modal functions
    function openModal() {
        modal.style.display = 'block';
        form.style.display = 'block';
        confirmation.style.display = 'none';
        form.reset();
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function submitForm() {
        const service = document.getElementById('serviceName').value;
        confirmedService.textContent = service;
        
        // Here you would normally send data to your server
        console.log('Form submitted for:', service);
        
        // Show confirmation
        form.style.display = 'none';
        confirmation.style.display = 'block';
        
        // Close modal after 3 seconds
        setTimeout(closeModal, 3000);
    }
});