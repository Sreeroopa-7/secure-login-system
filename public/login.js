const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeOpenIcon = document.getElementById('eyeOpenIcon');
const eyeClosedIcon = document.getElementById('eyeClosedIcon');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const message = document.getElementById('message');

function showMessage(text, type) {
    message.textContent = text;
    message.className = `status-message ${type}`;
}

togglePasswordBtn.addEventListener('click', function () {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePasswordBtn.setAttribute('aria-pressed', String(isHidden));
    togglePasswordBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    eyeOpenIcon.classList.toggle('hidden', isHidden);
    eyeClosedIcon.classList.toggle('hidden', !isHidden);
});

forgotPasswordLink.addEventListener('click', function (event) {
    event.preventDefault();
    showMessage('Password recovery is not enabled yet. Please contact your administrator.', 'info');
});

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage('Please enter both your email and password.', 'error');
        return;
    }

    loginBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message || 'Login successful!', 'success');
            loginForm.reset();
            window.location.href = 'dashboard.html';
        } else {
            showMessage(data.message || 'Login failed!', 'error');
        }
    } catch (error) {
        showMessage('Unable to connect to server!', 'error');
        console.error('Error:', error);
    } finally {
        loginBtn.disabled = false;
    }
});
