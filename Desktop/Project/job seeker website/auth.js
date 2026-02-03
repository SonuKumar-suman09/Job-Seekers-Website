// ====== AUTHENTICATION MANAGEMENT SYSTEM ======

// Initialize authentication state
function initializeAuth() {
    const user = getStoredUser();
    updateNavBarAuth(user);
}

// Get stored user from localStorage
function getStoredUser() {
    try {
        const userJson = localStorage.getItem('careerhubUser');
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error reading user from localStorage:', error);
        return null;
    }
}

// Store user data
function storeUser(userData) {
    try {
        localStorage.setItem('careerhubUser', JSON.stringify(userData));
        localStorage.setItem('userName', userData.name || '');
        localStorage.setItem('userEmail', userData.email || '');
        localStorage.setItem('loggedInAt', new Date().toISOString());
    } catch (error) {
        console.error('Error storing user:', error);
    }
}

// Logout user
function logoutUser() {
    try {
        localStorage.removeItem('careerhubUser');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userAccountType');
        localStorage.removeItem('userLocation');
        localStorage.removeItem('loggedInAt');
        
        // Redirect to login
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Update navigation bar based on auth state
function updateNavBarAuth(user) {
    const authContainer = document.getElementById('authContainer');
    if (!authContainer) return;
    
    if (user) {
        // User is logged in
        const shortName = user.name ? user.name.split(' ')[0] : 'User';
        authContainer.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm">
                    <i class="fas fa-user-circle text-blue-600 text-xl"></i>
                    <div class="text-sm hidden sm:block">
                        <p class="font-bold text-slate-900">${shortName}</p>
                        <p class="text-xs text-slate-600">${user.email || 'Logged in'}</p>
                    </div>
                </div>
                <button onclick="logoutUser()" class="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all flex items-center gap-2 transform hover:scale-105">
                    <i class="fas fa-sign-out-alt"></i>
                    <span class="hidden sm:inline">Logout</span>
                </button>
            </div>
        `;
    } else {
        // User is not logged in - Check which page we're on to render appropriate buttons
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage === 'home.html') {
            authContainer.innerHTML = `
                <a href="login.html" class="px-4 py-2 text-sm border border-slate-300 text-slate-700 font-semibold rounded-lg hover:border-slate-400 hover:bg-slate-50 transition flex items-center gap-1.5">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
                <a href="create-account.html" class="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-md hover:from-blue-700 hover:to-blue-800 transition flex items-center gap-1.5">
                    <i class="fas fa-user-plus"></i> Sign Up
                </a>
            `;
        } else {
            authContainer.innerHTML = `
                <button class="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-primary hidden sm:block">
                    <i class="fas fa-search text-lg"></i>
                </button>
                <a href="login.html" class="px-6 py-2 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition">
                    Login
                </a>
                <a href="create-account.html" class="px-6 py-2 gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition hidden sm:block">
                    Sign Up
                </a>
            `;
        }
    }
}

// Check if user is logged in
function isUserLoggedIn() {
    return getStoredUser() !== null;
}

// Get user profile info
function getUserProfile() {
    return getStoredUser();
}

// Update user profile
function updateUserProfile(updates) {
    const user = getStoredUser();
    if (user) {
        const updatedUser = { ...user, ...updates };
        storeUser(updatedUser);
        updateNavBarAuth(updatedUser);
        return updatedUser;
    }
    return null;
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isUserLoggedIn()) {
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
    }
}

// Redirect after login if there was a pending redirect
function handlePostLoginRedirect() {
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectUrl;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeAuth);
