const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (err) {
    return null;
  }
}

function handleGoogleCredentialResponse(response) {
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
  window.location.href = 'home - Copy.html';
}

function initGoogleLogin() {
  const errorMsg = document.getElementById('error-msg');
  const errorText = document.getElementById('errorText');

  if (window.location.protocol === 'file:') {
    if (errorMsg && errorText) {
      errorText.textContent = 'Google Login needs to run on http://localhost or https:// (not file://). Please use a local server.';
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    if (errorMsg && errorText) {
      errorText.textContent = 'Google Login failed to load. Please check your internet connection and refresh.';
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  if (GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')) {
    console.warn('Google Client ID not set. Replace GOOGLE_CLIENT_ID in login page - Copy.js');
    const btnHost = document.getElementById('googleSignInBtn');
    if (btnHost) {
      btnHost.innerHTML = '<button type="button" class="w-full py-2 border border-slate-300 text-slate-400 font-semibold rounded-lg cursor-not-allowed" disabled><i class="fab fa-google mr-2"></i>Google Login (Configure Client ID)</button>';
    }
    if (errorMsg && errorText) {
      errorText.textContent = 'Google Login is not configured. Add your Google Client ID to enable sign-in.';
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredentialResponse
  });

  window.google.accounts.id.renderButton(
    document.getElementById('googleSignInBtn'),
    {
      theme: 'outline',
      size: 'large',
      width: 320,
      text: 'signin_with'
    }
  );
}

// Form submission handler
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username')?.value;
  const password = document.getElementById('password')?.value;
  const errorMsg = document.getElementById('error-msg');
  const errorText = document.getElementById('errorText');

  if (!username || !password) {
    if (errorMsg && errorText) {
      errorText.textContent = 'Please enter both username and password';
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  // Validation
  if (password.length < 6) {
    if (errorMsg && errorText) {
      errorText.textContent = 'Password must be at least 6 characters';
      errorMsg.classList.remove('hidden');
    }
    return;
  }

  // Simple validation (in production, validate with server)
  if (username && password.length >= 6) {
    errorMsg.classList.add('hidden');
    localStorage.setItem('userEmail', username);
    document.getElementById('loginForm').reset();
    
    // Redirect to home after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'home - Copy.html';
    }, 1500);
  }
});

document.addEventListener('DOMContentLoaded', initGoogleLogin);
