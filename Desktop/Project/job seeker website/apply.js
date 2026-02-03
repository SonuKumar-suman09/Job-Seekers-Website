// Application Management System
class ApplicationManager {
  constructor() {
    this.applications = JSON.parse(localStorage.getItem('jobApplications')) || [];
    this.savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    this.appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
  }

  saveApplication(data) {
    const application = {
      id: Date.now(),
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    this.applications.push(application);
    localStorage.setItem('jobApplications', JSON.stringify(this.applications));
    return application;
  }

  getApplications() {
    return this.applications;
  }

  getApplicationStats() {
    return {
      total: this.applications.length,
      pending: this.applications.filter(a => a.status === 'pending').length,
      accepted: this.applications.filter(a => a.status === 'accepted').length,
      rejected: this.applications.filter(a => a.status === 'rejected').length
    };
  }
}

const appManager = new ApplicationManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  setupFormValidation();
  loadSavedFormData();
  applySavedLocation();
  wireLocationDetection();
  displayJobInfo();
  if (!localStorage.getItem('userLocation')) {
    setTimeout(() => detectApplyLocation(), 800);
  }
});

// Display job info at top of apply form
function displayJobInfo() {
  const lastApplyJob = JSON.parse(localStorage.getItem('lastApplyJob'));
  if (lastApplyJob) {
    const jobCompanyText = document.getElementById('jobCompanyText');
    const jobTitleText = document.getElementById('jobTitleText');
    const jobCompanyNameText = document.getElementById('jobCompanyNameText');
    const jobLogo = document.getElementById('jobLogo');
    const logoFallback = document.getElementById('logoFallback');
    
    if (jobCompanyText) jobCompanyText.textContent = 'Applying to';
    if (jobTitleText) jobTitleText.textContent = lastApplyJob.title || 'Position';
    if (jobCompanyNameText) jobCompanyNameText.textContent = lastApplyJob.company || 'Company';
    
    // Get company initials for fallback
    const initials = (lastApplyJob.company || 'J')
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    // Display logo if available with improved error handling
    if (jobLogo && lastApplyJob.logo) {
      jobLogo.src = lastApplyJob.logo;
      jobLogo.style.display = 'block';
      let logoRetries = 0;
      
      jobLogo.onload = function() {
        if (logoFallback) logoFallback.style.display = 'none';
      };
      
      jobLogo.onerror = function() {
        if (logoRetries < 1) {
          logoRetries++;
          // Try alternative image service
          this.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(lastApplyJob.company.toLowerCase())}&sz=128`;
          return;
        }
        this.style.display = 'none';
        if (logoFallback) {
          logoFallback.style.display = 'flex';
          logoFallback.textContent = initials;
        }
      };
    } else if (logoFallback) {
      logoFallback.textContent = initials;
      logoFallback.style.display = 'flex';
    }
  }
}

// Form Validation
function setupFormValidation() {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  // Auto-fill stored name if available
  const storedName = localStorage.getItem('userName');
  if (storedName && nameInput) {
    nameInput.value = storedName;
  }

  // Email validation
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      validateEmail(this.value);
    });
  }

  // Phone validation
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9-]/g, '');
    });
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[0-9]{5}-[0-9]{5}$/;
  return phoneRegex.test(phone);
}

function loadSavedFormData() {
  const savedData = localStorage.getItem('applicationDraft');
  if (savedData) {
    const data = JSON.parse(savedData);
    Object.keys(data).forEach(key => {
      const input = document.getElementById(key);
      if (input) {
        input.value = data[key];
      }
    });
  }
}

function applySavedLocation() {
  const savedLocation = localStorage.getItem('userLocation');
  const locationInput = document.getElementById('location');
  if (savedLocation && locationInput) {
    locationInput.value = savedLocation;
  }
}

function setApplyLocation(locationText) {
  const locationInput = document.getElementById('location');
  if (locationInput) {
    locationInput.value = locationText;
    localStorage.setItem('userLocation', locationText);
  }
}

function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  return fetch(url, { headers: { 'Accept-Language': 'en' } })
    .then(res => res.json())
    .then(data => {
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || '';
      const state = addr.state || '';
      const country = addr.country || '';
      const parts = [city, state, country].filter(Boolean);
      return parts.length ? parts.join(', ') : `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    })
    .catch(() => `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
}

function detectApplyLocation() {
  if (!navigator.geolocation) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const locationText = await reverseGeocode(latitude, longitude);
      setApplyLocation(locationText);
    },
    () => {},
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
}

function wireLocationDetection() {
  const detectBtn = document.getElementById('detectApplyLocationBtn');
  if (detectBtn) {
    detectBtn.addEventListener('click', detectApplyLocation);
  }
}

// Auto-save form data as user types (Draft)
document.addEventListener('input', function(e) {
  if (e.target.closest('form')) {
    const form = e.target.closest('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    localStorage.setItem('applicationDraft', JSON.stringify(data));
  }
});

// Export application as PDF (simulated)
function exportApplicationPDF() {
  const printWindow = window.open('', '', 'width=800,height=600');
  const form = document.getElementById('jobApplicationForm');
  printWindow.document.write('<html><head><title>Application - CareerHub</title></head><body>');
  printWindow.document.write(form.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.print();
}

// Share success on social media
function shareSuccess() {
  const text = "I just applied to an amazing job on CareerHub! 🚀 Join me on the journey to find your dream career!";
  const url = "https://careerhub.in";
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedinUrl, '_blank');
}

// Track application analytics
function trackApplicationEvent(eventName, eventData) {
  const event = {
    name: eventName,
    data: eventData,
    timestamp: new Date().toISOString()
  };
  
  let events = JSON.parse(localStorage.getItem('applicationEvents')) || [];
  events.push(event);
  localStorage.setItem('applicationEvents', JSON.stringify(events));
  
  console.log('Event tracked:', event);
}
