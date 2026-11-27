const loadingState = document.getElementById('loadingState');
const dashboardContent = document.getElementById('dashboardContent');
const welcomeName = document.getElementById('welcomeName');
const welcomeText = document.getElementById('welcomeText');
const userInitials = document.getElementById('userInitials');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userId = document.getElementById('userId');
const logoutBtn = document.getElementById('logoutBtn');
const cardLogoutBtn = document.getElementById('cardLogoutBtn');
const message = document.getElementById('message');

function getInitials(name) {
    if (!name) return 'U';
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
}

async function loadDashboard() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/dashboard', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            window.location.replace('login.html');
            return;
        }

        const data = await response.json();
        const user = data.user || {};
        const name = user.name || 'User';
        const email = user.email || '';

        welcomeName.textContent = name;
        welcomeText.textContent = data.message || 'Welcome to your dashboard!';
        userInitials.textContent = getInitials(name);
        profileName.textContent = name;
        profileEmail.textContent = email;
        userName.textContent = name;
        userEmail.textContent = email;
        userId.textContent = user.id !== undefined ? `#${user.id}` : '—';

        loadingState.classList.add('hidden');
        dashboardContent.classList.remove('hidden');
    } catch (error) {
        console.error('Dashboard error:', error);
        window.location.replace('login.html');
    }
}

async function handleLogout() {
    logoutBtn.disabled = true;
    cardLogoutBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            window.location.replace('login.html');
        } else {
            message.textContent = data.message || 'Logout failed!';
            message.className = 'status-message error';
            logoutBtn.disabled = false;
            cardLogoutBtn.disabled = false;
        }
    } catch (error) {
        message.textContent = 'Unable to connect to server!';
        message.className = 'status-message error';
        logoutBtn.disabled = false;
        cardLogoutBtn.disabled = false;
        console.error('Logout error:', error);
    }
}

logoutBtn.addEventListener('click', handleLogout);
cardLogoutBtn.addEventListener('click', handleLogout);

loadDashboard();
