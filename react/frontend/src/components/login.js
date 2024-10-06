import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Import the CSS file for styles

const Login = () => {
    const navigate = useNavigate(); // Hook for navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post('http://localhost:8080/user/login', {
                username: username,
                password: password
            });

            if (response.status === 200) {
                alert('Login successful!');
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                alert('Login failed: ' + response.data.message);
            }
        } catch (error) {
            alert('Invalid Credentials ');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2> User Login</h2>
                <input id="username" type="text" placeholder="Username" required />
                <input id="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
                <p className="register-link">
                    Don't have an account? 
                    <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}>
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
