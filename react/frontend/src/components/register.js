import React, { useState } from 'react';
import axios from 'axios';
import './register.css'; // Import the CSS file for styles
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [message, setMessage] = useState('');
  const [specialization, setSpecialization] = useState(''); // Add specialization state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage(''); // Clear previous messages

    // Create user data object
    const userData = {
        username,
        password,
        role,
        specialization: role === 'doctor' ? specialization : '' // Include specialization only for doctors
    };

    try {
        const response = await axios.post('http://localhost:8080/user/register', userData);
        console.log('Response:', response.data); // Log the response from the server

        // Check response success
        if (response.status === 200) {
            setMessage('Registration successful! Please login.');
            navigate('/login'); // Navigate to login page
        } else {
            setMessage(response.data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error); // Log the error for debugging
        setMessage('Registration failed. UserName Already exists'); // Generic error message
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
                            required // Optional: Add required if specialization is mandatory
                        />
                    </div>
                )}
                <button type="submit">Register</button>
                {message && <p className="message">{message}</p>} {/* Display message here */}
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
