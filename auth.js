document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            const users = JSON.parse(localStorage.getItem('tiktok_users')) || [];
            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                alert('An account with this email already exists.');
            } else {
                users.push({ username, email, password, isPremium: false });
                localStorage.setItem('tiktok_users', JSON.stringify(users));
                alert('Sign up successful! Please log in.');
                window.location.href = 'login.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const users = JSON.parse(localStorage.getItem('tiktok_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password.');
            }
        });
    }
});
