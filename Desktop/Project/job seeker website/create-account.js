const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const USERS_KEY = 'careerhubUsers';

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalize(value) {
  return (value || '').trim().toLowerCase();
}

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (err) {
    return null;
  }
}

function handleGoogleSignupResponse(response) {
  const profile = decodeJwt(response.credential);
  if (!profile) {
    return;
  }

  const user = {
    name: profile.name,
    email: profile.email,
    picture: profile.picture,
    provider: 'google',
    loggedInAt: new Date().toISOString()
  };
  localStorage.setItem('careerhubUser', JSON.stringify(user));
  localStorage.setItem('userName', user.name || '');
  localStorage.setItem('userEmail', user.email || '');
  window.location.href = 'home - Copy.html';
}

function initGoogleSignup() {
  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");

  if (window.location.protocol === 'file:') {
    if (errorMessage && errorText) {
      errorText.textContent = 'Google Sign Up needs to run on http://localhost or https:// (not file://). Please use a local server.';
      errorMessage.classList.remove("hidden");
    }
    return;
  }

  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    if (errorMessage && errorText) {
      errorText.textContent = 'Google Sign Up failed to load. Please check your internet connection and refresh.';
      errorMessage.classList.remove("hidden");
    }
    return;
  }

  if (GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
    console.warn('Google Client ID not set. Replace GOOGLE_CLIENT_ID in create account - Copy.js');
    const btnHost = document.getElementById('googleSignUpBtn');
    if (btnHost) {
      btnHost.innerHTML = '<button type="button" class="w-full py-2 border border-slate-300 text-slate-400 font-semibold rounded-lg cursor-not-allowed" disabled><i class="fab fa-google mr-2"></i>Google Sign Up (Configure Client ID)</button>';
    }
    if (errorMessage && errorText) {
      errorText.textContent = 'Google Sign Up is not configured. Add your Google Client ID to enable sign-up.';
      errorMessage.classList.remove("hidden");
    }
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleSignupResponse
  });

  window.google.accounts.id.renderButton(
    document.getElementById('googleSignUpBtn'),
    {
      theme: 'outline',
      size: 'large',
      width: 320,
      text: 'signup_with'
    }
  );
}

// Form submission handler
document.getElementById("signupForm")?.addEventListener("submit", function(event) {
  event.preventDefault();
  
  const fullName = document.getElementById("fullName")?.value?.trim();
  const email = document.getElementById("email")?.value?.trim();
  const phone = document.getElementById("phone")?.value?.trim();
  const password = document.getElementById("password")?.value;
  const confirmPassword = document.getElementById("confirmPassword")?.value;
  const accountType = document.querySelector('input[name="accountType"]:checked')?.value;
  const terms = document.getElementById("terms")?.checked;

  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  const successMessage = document.getElementById("successMessage");

  // Clear previous messages
  if (errorMessage) errorMessage.classList.add("hidden");
  if (successMessage) successMessage.classList.add("hidden");

  // Validation checks
  if (!fullName) {
    errorText.textContent = "❌ Full name is required";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (fullName.length < 3) {
    errorText.textContent = "❌ Full name must be at least 3 characters";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!email) {
    errorText.textContent = "❌ Email address is required";
    errorMessage.classList.remove("hidden");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errorText.textContent = "❌ Please enter a valid email address (e.g., user@example.com)";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!phone) {
    errorText.textContent = "❌ Phone number is required";
    errorMessage.classList.remove("hidden");
    return;
  }

  const phonePattern = /^[\d\s\-\+\(\)]+$/;
  if (!phonePattern.test(phone) || phone.replace(/\D/g, '').length < 10) {
    errorText.textContent = "❌ Please enter a valid phone number (at least 10 digits)";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!password) {
    errorText.textContent = "❌ Password is required";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (password.length < 8) {
    errorText.textContent = "❌ Password must be at least 8 characters long";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!password.match(/[A-Z]/)) {
    errorText.textContent = "❌ Password must contain at least one uppercase letter (A-Z)";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!password.match(/[a-z]/)) {
    errorText.textContent = "❌ Password must contain at least one lowercase letter (a-z)";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!password.match(/\d/)) {
    errorText.textContent = "❌ Password must contain at least one number (0-9)";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!confirmPassword) {
    errorText.textContent = "❌ Please confirm your password";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (password !== confirmPassword) {
    errorText.textContent = "❌ Passwords do not match. Please check and try again.";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!accountType) {
    errorText.textContent = "❌ Please select an account type (Job Seeker or Employer)";
    errorMessage.classList.remove("hidden");
    return;
  }

  if (!terms) {
    errorText.textContent = "❌ Please accept the Terms of Service and Privacy Policy";
    errorMessage.classList.remove("hidden");
    return;
  }

  const users = getUsers();
  const existingUser = users.find(u => normalize(u.email) === normalize(email));
  if (existingUser) {
    errorText.textContent = "❌ This email is already registered. Please log in instead.";
    errorMessage.classList.remove("hidden");
    return;
  }

  // Success - store user data
  const user = {
    name: fullName,
    email: email,
    phone: phone,
    password: password,
    accountType: accountType,
    provider: 'password',
    createdAt: new Date().toISOString(),
    loggedInAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);

  // Use auth system to store user
  if (typeof storeUser === 'function') {
    storeUser(user);
  } else {
    localStorage.setItem('careerhubUser', JSON.stringify(user));
    localStorage.setItem('userName', fullName);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userAccountType', accountType);
    localStorage.setItem('loggedInAt', user.loggedInAt);
  }

  if (successMessage) {
    successMessage.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fas fa-check-circle text-green-600 text-xl"></i>
        <div>
          <span class="text-green-700 font-semibold">✅ Account created successfully!</span>
          <p class="text-sm text-green-600">Welcome, ${fullName}! Redirecting to home page...</p>
        </div>
      </div>
    `;
    successMessage.classList.remove("hidden");
  }

  this.reset();
  
  setTimeout(() => {
    window.location.href = 'home.html';
  }, 2000);
});

document.addEventListener('DOMContentLoaded', initGoogleSignup);
