import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HealthRecordUpload.css'; // Import the CSS file for styling

const HealthRecordUpload = ({ userId }) => {
    const [recordUrl, setRecordUrl] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleUpload = async (e) => {
        e.preventDefault();

        const healthRecordData = {
            recordUrl,
            timestamp
        };

        try {
            const response = await axios.post('http://localhost:8080/user/uploadHealthRecord', healthRecordData, {
                headers: {
                    'userId': userId // Pass userId in headers
                }
            });

            setMessage(response.data.message);
            setRecordUrl('');
            setTimestamp('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error uploading health record');
        }
    };

    const handleNavigateToAppointments = () => {
        navigate('/Appointments'); // Use navigate to go to the Appointments page
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>Appointments</h2>
                <nav>
                    <ul>
                        <li onClick={() => navigate('/PatientDashboard')}>Dashboard</li>
                        <li onClick={handleNavigateToAppointments}>Appointments</li>
                        <li onClick={() => navigate('/health-records')}>Health Records</li>
                        <li onClick={() => navigate('/messages')}>Messages</li>
                        <li onClick={() => navigate('/wellness-bot')}>Wellness Chatbot</li>
                        <li onClick={() => navigate('/userProfile')}>Settings</li>
                    </ul>
                </nav>
            </aside>

            <div className="upload-container">
                <h2>Upload Health Record</h2>
                <form onSubmit={handleUpload}>
                    <div className="form-group">
                        <label htmlFor="recordUrl">Record URL:</label>
                        <input
                            type="url"
                            id="recordUrl"
                            value={recordUrl}
                            onChange={(e) => setRecordUrl(e.target.value)}
                            required
                            placeholder="Enter the health record URL"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="timestamp">Timestamp:</label>
                        <input
                            type="datetime-local"
                            id="timestamp"
                            value={timestamp}
                            onChange={(e) => setTimestamp(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Upload</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default HealthRecordUpload;
