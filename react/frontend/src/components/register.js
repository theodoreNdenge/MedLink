import React, { useState } from 'react';
import api from '../api';
import './register.css'; // Import the CSS file for styles
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient'); // Default role is patient
    const [specialization, setSpecialization] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const response = await api.post('/register', {
                username,
                password,
                role,
                specialization: role === 'doctor' ? specialization : ''
            });
            setMessage('Registration successful! Please login.');
        } catch (error) {
            setMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                <div>
                
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Enter Username'
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter Password'
                        required
                    />
                </div>
                <div>
                    
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        
                    </select>
                </div>
                {role === 'doctor' && (
                    <div>
                        
                        <input
                            type="text"
                            value={specialization}
                            placeholder='Enter Specialization'
                            onChange={(e) => setSpecialization(e.target.value)}
                        />
                    </div>
                )}
                <button type="submit">Register</button>

                 <p className="register-link">
                    Already have an account? 
                    <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}>
                       Login
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Register;
