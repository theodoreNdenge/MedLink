import React, { useState } from 'react';
import './sign-up.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        // Handle signup logic here
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div className="signup-container">
            <img src="/images/img2.jpg" alt="Background" className="background-image" />
            <form className="signup-form" onSubmit={handleSignup}>
                <h2>Sign Up</h2>
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;