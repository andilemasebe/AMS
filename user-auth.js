document.addEventListener('DOMContentLoaded', () => {
    // Password strength checker
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const strength = checkPasswordStrength(e.target.value);
            const strengthIndicator = document.querySelector('.password-strength');
            strengthIndicator.className = `password-strength strength-${strength}`;
        });
    }

    // Form submission handlers
    const loginForm = document.getElementById('userLoginForm');
    const registerForm = document.getElementById('userRegisterForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const button = document.getElementById('loginBtn');
    setButtonLoading(button, true);

    const formData = new FormData(e.target);
    const errors = validateForm(formData);

    if (errors.length === 0) {
        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                window.location.href = '/user/dashboard';
            } else {
                showError('Invalid credentials');
            }
        } catch (error) {
            showError('Login failed. Please try again.');
        }
    } else {
        showError(errors.join('\n'));
    }

    setButtonLoading(button, false);
}

async function handleRegister(e) {
    e.preventDefault();
    const button = document.getElementById('registerBtn');
    setButtonLoading(button, true);

    const formData = new FormData(e.target);
    const errors = validateForm(formData);

    if (errors.length === 0) {
        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                window.location.href = '/user/login?registered=true';
            } else {
                showError('Registration failed. Please try again.');
            }
        } catch (error) {
            showError('Registration failed. Please try again.');
        }
    } else {
        showError(errors.join('\n'));
    }

    setButtonLoading(button, false);
}
