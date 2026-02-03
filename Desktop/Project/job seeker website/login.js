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

function findUserByIdentifier(identifier, users) {
  const id = normalize(identifier);
  if (!id) return null;
  const isEmail = id.includes('@');
  return users.find(user => {
    const email = normalize(user.email);
    const name = normalize(user.name);
    const emailPrefix = email ? email.split('@')[0] : '';
    if (isEmail) return email === id;
    return name === id || emailPrefix === id;
  });
}

function ensureDefaultUser() {
  const users = getUsers();
  if (users.length > 0) return;
  users.push({
    name: 'Sonu Kumar Suman',
    email: 'sonu@example.com',
    phone: '+91 98765-43210',
    location: 'Bengaluru, Karnataka',
    accountType: 'seeker',
    provider: 'password',
    password: 'sonu123',
    createdAt: new Date().toISOString()
  });
  saveUsers(users);
}

ensureDefaultUser();

document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const fullname = document.getElementById("fullname").value.trim();
  const errorMsg = document.getElementById("error-msg");
  const errorText = document.getElementById("errorText");
  
  // Clear previous error
  errorMsg.style.display = "none";
  errorText.textContent = "";
  
  // Validation checks
  if (!username) {
    errorText.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Please enter your email or username';
    errorMsg.style.display = "block";
    return;
  }
  
  if (!password) {
    errorText.innerHTML = '<i class="fas fa-lock mr-2"></i>Please enter your password';
    errorMsg.style.display = "block";
    return;
  }
  
  if (password.length < 6) {
    errorText.innerHTML = '<i class="fas fa-shield-alt mr-2"></i>Password must be at least 6 characters long';
    errorMsg.style.display = "block";
    return;
  }
  
  // Check valid email format if email provided
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (username.includes("@") && !emailPattern.test(username)) {
    errorText.innerHTML = '<i class="fas fa-at mr-2"></i>Please enter a valid email address';
    errorMsg.style.display = "block";
    return;
  }
  
  const users = getUsers();
  const matchedUser = findUserByIdentifier(username, users);

  // Correct credentials check
  if (matchedUser && matchedUser.password === password) {
    errorMsg.className = "p-4 bg-green-50 border border-green-200 rounded-lg";
    errorText.className = "text-green-700 font-semibold";
    errorText.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Login successful! Redirecting...';
    errorMsg.style.display = "block";
    
    // Create user object and store
    const displayName = fullname || matchedUser.name || "User";
    const user = {
      ...matchedUser,
      name: displayName,
      provider: 'password',
      loggedInAt: new Date().toISOString()
    };

    // Update stored user name if changed
    if (displayName !== matchedUser.name) {
      matchedUser.name = displayName;
      saveUsers(users);
    }
    
    // Use auth system to store user
    if (typeof storeUser === 'function') {
      storeUser(user);
    } else {
      localStorage.setItem('careerhubUser', JSON.stringify(user));
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userPhone', user.phone);
      localStorage.setItem('userLocation', user.location);
      localStorage.setItem('loggedInAt', user.loggedInAt);
    }
    
    setTimeout(() => {
      // Check for redirect after login
      if (typeof handlePostLoginRedirect === 'function') {
        handlePostLoginRedirect();
      } else {
        window.location.href = "home.html";
      }
    }, 1500);
  } else {
    // Wrong credentials
    errorMsg.className = "p-4 bg-red-50 border border-red-200 rounded-lg";
    errorText.className = "text-red-700 font-semibold";
    
    // Check if username exists
    if (!matchedUser) {
      errorText.innerHTML = '<i class="fas fa-user-slash mr-2"></i><strong>User not found.</strong> Please check your email or sign up.';
    } else {
      errorText.innerHTML = '<i class="fas fa-key mr-2"></i><strong>Incorrect password.</strong> Please try again or reset your password.';
    }
    
    errorMsg.style.display = "block";
  }
});

// Forgot password handling
const forgotLink = document.getElementById('forgotPasswordLink');
const forgotModal = document.getElementById('forgotPasswordModal');
const forgotClose = document.getElementById('forgotPasswordClose');
const forgotCancel = document.getElementById('forgotCancel');
const forgotForm = document.getElementById('forgotPasswordForm');
const forgotMsg = document.getElementById('forgotPasswordMsg');

function openForgotModal() {
  if (forgotModal) forgotModal.classList.remove('hidden');
}

function closeForgotModal() {
  if (forgotModal) forgotModal.classList.add('hidden');
  if (forgotMsg) {
    forgotMsg.className = 'hidden';
    forgotMsg.textContent = '';
  }
  const emailInput = document.getElementById('forgotEmail');
  const newPass = document.getElementById('forgotNewPassword');
  const confirmPass = document.getElementById('forgotConfirmPassword');
  if (emailInput) emailInput.value = '';
  if (newPass) newPass.value = '';
  if (confirmPass) confirmPass.value = '';
}

if (forgotLink) {
  forgotLink.addEventListener('click', function(e) {
    e.preventDefault();
    openForgotModal();
  });
}

if (forgotClose) forgotClose.addEventListener('click', closeForgotModal);
if (forgotCancel) forgotCancel.addEventListener('click', closeForgotModal);

if (forgotForm) {
  forgotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = normalize(document.getElementById('forgotEmail')?.value);
    const newPassword = document.getElementById('forgotNewPassword')?.value || '';
    const confirmPassword = document.getElementById('forgotConfirmPassword')?.value || '';

    if (!email || !email.includes('@')) {
      if (forgotMsg) {
        forgotMsg.className = 'p-3 rounded-lg bg-red-50 border border-red-200 text-red-700';
        forgotMsg.textContent = 'Please enter a valid email address.';
      }
      return;
    }

    if (newPassword.length < 8) {
      if (forgotMsg) {
        forgotMsg.className = 'p-3 rounded-lg bg-red-50 border border-red-200 text-red-700';
        forgotMsg.textContent = 'Password must be at least 8 characters long.';
      }
      return;
    }

    if (newPassword !== confirmPassword) {
      if (forgotMsg) {
        forgotMsg.className = 'p-3 rounded-lg bg-red-50 border border-red-200 text-red-700';
        forgotMsg.textContent = 'Passwords do not match.';
      }
      return;
    }

    const usersList = getUsers();
    const user = usersList.find(u => normalize(u.email) === email);
    if (!user) {
      if (forgotMsg) {
        forgotMsg.className = 'p-3 rounded-lg bg-red-50 border border-red-200 text-red-700';
        forgotMsg.textContent = 'No account found with this email.';
      }
      return;
    }

    user.password = newPassword;
    saveUsers(usersList);

    if (forgotMsg) {
      forgotMsg.className = 'p-3 rounded-lg bg-green-50 border border-green-200 text-green-700';
      forgotMsg.textContent = 'Password updated successfully. You can now log in.';
    }
  });
}
