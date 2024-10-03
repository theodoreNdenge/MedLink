import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle signup logic here
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div className="login-container">
            <img src="/images/img2.jpg" alt="Background" className="background-image" />
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login as Doctor</button>
                <button type="submit">Login as Patient</button>
                <button type="button" onClick={() => navigate('/sign-up')}>
                    Don't have an account? Sign up
                </button>
                <button type="submit" onClick={() => navigate('./home')}>Home</button>
            </form>
        </div>
    );
};

export default Login;