const registerForm = document.getElementById('registerForm');
const registerBtn = document.getElementById('registerBtn');
const message = document.getElementById('message');

function showMessage(text, type) {
    message.textContent = text;
    message.className = `status-message ${type}`;
}

registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match.', 'error');
        document.getElementById('confirmPassword').focus();
        return;
    }

    registerBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message || 'Registration successful!', 'success');
            registerForm.reset();
        } else {
            showMessage(data.message || 'Registration failed!', 'error');
        }

    } catch (error) {
        showMessage('Unable to connect to server!', 'error');
        console.error('Error:', error);
    } finally {
        registerBtn.disabled = false;
    }
});
