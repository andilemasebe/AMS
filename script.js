// Form visibility toggles
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            if (data.role === 'admin') {
                showAdminDashboard();
            } else {
                window.location.href = '/dashboard.html';
            }
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        alert('Login failed');
    }
}

// Handle Registration
async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful');
            showLogin();
        } else {
            alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        alert('Registration failed');
    }
}

// Admin Dashboard Functions
async function showAdminDashboard() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    await loadUsers();
}

async function loadUsers() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        alert('Failed to load users');
    }
}

function displayUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="deleteUser(${user.id})">Delete</button>
                <button onclick="editUser(${user.id})">Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Password Strength Checker
function checkPasswordStrength(password) {
    const strengthIndicator = document.querySelector('.password-strength');
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars]
        .filter(Boolean).length;

    strengthIndicator.className = 'password-strength';
    if (password.length < 8) return 'weak';
    if (strength < 3) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
}

// Form Validation
function validateForm(formData) {
    const validations = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        password: {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: 'Password must be at least 8 characters with letters and numbers'
        },
        username: {
            pattern: /^[a-zA-Z0-9_]{3,20}$/,
            message: 'Username must be 3-20 characters long with only letters, numbers and underscore'
        }
    };

    const errors = [];
    for (const [field, value] of formData.entries()) {
        if (validations[field] && !validations[field].pattern.test(value)) {
            errors.push(validations[field].message);
        }
    }
    
    return errors;
}

// Button Loading States
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}
