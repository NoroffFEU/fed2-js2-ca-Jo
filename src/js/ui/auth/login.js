import { API_AUTH_LOGIN } from '../../api/constants';

export async function onLogin(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const email = form.get("email");
    const password = form.get("password");
    const body = {
        email: email,
        password: password,
    };

    try {
        const response = await fetch(API_AUTH_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.data.accessToken);
            window.location.href = '/post/';
        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData.message);
            alert('Login failed: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
    }
}
