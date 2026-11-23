const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const enquiryForm = document.getElementById('enquiryForm');
const formStatus = document.getElementById('formStatus');

// Add your Formspree endpoint to FORM_ENDPOINT to receive enquiries by email.
// Example: const FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
const FORM_ENDPOINT = '';

enquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!enquiryForm.reportValidity()) return;

  if (!FORM_ENDPOINT) {
    const data = new FormData(enquiryForm);
    const message = [
      'Hello RAJ FOUNTAIN AND SWIMMING POOL,',
      '',
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Email: ${data.get('email') || 'Not provided'}`,
      `Interest: ${data.get('project_type')}`,
      `Location: ${data.get('location') || 'Not provided'}`,
      `Requirements: ${data.get('message') || 'Not provided'}`
    ].join('\n');

    const whatsappUrl = `https://wa.me/919672117111?text=${encodeURIComponent(message)}`;
    formStatus.textContent = 'Opening WhatsApp with your enquiry. Send the pre-filled message there to contact the business.';
    window.open(whatsappUrl, '_blank', 'noopener');
    return;
  }

  const submitButton = enquiryForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending…';

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: new FormData(enquiryForm),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Unable to submit enquiry');
    formStatus.textContent = 'Thank you. Your enquiry has been submitted successfully.';
    enquiryForm.reset();
  } catch (error) {
    formStatus.textContent = 'The enquiry could not be submitted. Please contact us directly on WhatsApp or phone.';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send Enquiry <span>↗</span>';
  }
});
