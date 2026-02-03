// ====== DOM ELEMENTS ====== 
const searchBtn = document.getElementById('search-btn');
const loginBtn = document.getElementById('login-btn');
const menuBtn = document.getElementById('menu-btn');
const searchPanel = document.getElementById('search-panel');
const loginPanel = document.getElementById('login-panel');
const searchInput = document.getElementById('search-input');

// ====== NAVIGATION & MENU FUNCTIONS ====== 
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        console.log('Menu clicked');
    });
}

if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchPanel.classList.toggle('active');
        if (loginPanel) loginPanel.classList.remove('active');
    });
}

if (loginBtn && loginPanel) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginPanel.classList.toggle('active');
        if (searchPanel) searchPanel.classList.remove('active');
    });
}

// Close panels when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-panel') && 
        !e.target.closest('.login-panel') &&
        !e.target.closest('#search-btn') &&
        !e.target.closest('#login-btn')) {
        searchPanel.classList.remove('active');
        loginPanel.classList.remove('active');
    }
});

// ====== SEARCH FUNCTIONALITY ====== 
if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
    });
}

// ====== LOGIN HANDLER ====== 
function handleLogin(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    if (email && password.length >= 6) {
        alert('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'home - Copy.html';
        }, 1000);
    } else {
        alert('Please enter valid email and password (min 6 characters)');
    }
}

// ====== SMOOTH SCROLL & ANIMATIONS ====== 
window.addEventListener('scroll', () => {
    if (searchPanel) searchPanel.classList.remove('active');
    if (loginPanel) loginPanel.classList.remove('active');
});

// ====== UTILITY FUNCTIONS ====== 
function showNotification(message, type = 'success', duration = 4000) {
    const notification = document.createElement('div');
    
    const styles = {
        success: { bg: 'bg-gradient-to-r from-green-500 to-green-600', icon: 'check-circle', ring: 'ring-green-300' },
        error: { bg: 'bg-gradient-to-r from-red-500 to-red-600', icon: 'times-circle', ring: 'ring-red-300' },
        info: { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: 'info-circle', ring: 'ring-blue-300' }
    };
    
    const style = styles[type] || styles.success;
    const existingNotifs = document.querySelectorAll('.custom-notification');
    const topOffset = 20 + (existingNotifs.length * 90);
    
    notification.className = `custom-notification fixed right-4 p-4 pr-12 rounded-xl text-white font-semibold z-50 shadow-2xl ring-2 ${style.bg} ${style.ring} transform transition-all duration-300`;
    notification.style.top = `${topOffset}px`;
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(400px)';
    notification.style.minWidth = '320px';
    
    notification.innerHTML = `
        <div class="flex items-start gap-3">
            <i class="fas fa-${style.icon} text-2xl flex-shrink-0 mt-1"></i>
            <p class="flex-1">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="absolute top-3 right-3 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateX(0)'; }, 10);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}