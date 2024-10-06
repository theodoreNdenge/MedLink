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
    
            console.log('Response:', response.data);
    
            if (response.status === 200 && response.data.status === 'success') {
                alert('Login successful!');
                const userId = response.data.userId; // Assuming your response contains userId
                  localStorage.setItem('userId', userId); // Store user ID in local storage
                  const username = response.data.username; // Assuming your response contains userId
                  localStorage.setItem('username', username); // Store user ID in local storage
                  console.log(username)
    
                // Extract the role directly from the response data
                const userRole = response.data.role.toLowerCase();
    
                if (userRole) {
                    // Set the role in localStorage
                    localStorage.setItem('role', userRole);
    
                    // Redirect based on the role
                    if (userRole === 'patient') {
                        console.log("Redirecting to patient dashboard...");
                        navigate('/patient-dashboard'); // Redirect to patient dashboard
                    } else if (userRole === 'doctor') {
                        navigate('/doctor-dashboard'); // Redirect to doctor dashboard
                    }
                } else {
                    alert('Failed to determine user role. Please try again.');
                }
            } else {
                alert('Login failed: ' + response.data.message);
            }
        } catch (error) {
            alert('Invalid Credentials');
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
