import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css'; // Import CSS for styling if needed

const UserProfile = ({ username, onLogout }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/details`, {
                    headers: {
                        'userId': username // Pass userId in headers
                    }
                });
                setUserProfile(response.data);
            } catch (error) {
                setMessage('Error fetching user profile');
            }
        };

        fetchUserProfile();
    }, [username]);

    const handleLogout = () => {
        // Clear any stored user data and call the logout function passed from parent
        onLogout();
        navigate('/login'); // Redirect to login page
    };

    if (!userProfile) {
        return <p>Loading...</p>; // Or handle loading state as needed
    }
    const handleNavigateToAppointments = () => {
        navigate('/Appointments'); // Use navigate to go to the Appointments page
      };
    return (
        <div className="dashboard-container">
        <aside className="sidebar">
          <h2> WELLNESS BOT</h2>
          <nav>
            <ul>
              <li onClick={() => navigate('/PatientDashboard')}>Dashboard</li>
              <li onClick={handleNavigateToAppointments}>Appointments</li>
              <li  onClick={() => navigate('/health-records')}>Health Records</li>
              <li onClick={() => navigate('/messages')}>Messages</li>
              <li onClick={() => navigate('/wellness-bot')}>Wellness Chatbot</li>
              <li onClick={() => navigate('/userProfile')}  >Settings</li>
            </ul>
          </nav>
        </aside>
        <div className="user-profile-container">
            <h2>User Profile</h2>
            {message && <p className="error-message">{message}</p>}
            <div className="profile-details">
                <p><strong>Name:</strong> {userProfile.name}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Role:</strong> {userProfile.role}</p>
                {/* Add more fields as necessary */}
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        </div>
    );
};

export default UserProfile;
