import React, { useEffect, useState } from 'react';
import './patientDashboard.css'; // Create this file for custom styles
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');

  // Retrieve the userId and username from local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchAppointments(storedUserId);
    }
  
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const fetchAppointments = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/appointment/${id}`); // Use the correct endpoint
      setAppointments(response.data); // Assuming the API returns a list of appointments
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleNavigateToAppointments = () => {
    navigate('/Appointments'); // Use navigate to go to the Appointments page
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2> Dashboard</h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/PatientDashboard')}>Dashboard</li>
            <li onClick={handleNavigateToAppointments}>Appointments</li>
            <li>Prescription</li>
            <li onClick={() => navigate('/messages')}>Messages</li>
            <li onClick={() => navigate('/wellness-bot')}>Wellness Chatbot</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>Hello, {username}!</h2>
          <p>You have incomplete health tasks today.</p>
        </header>

        <section className="stats-section">
          <div className="stat-card">
            <h3>87.52%</h3>
            <p>Health Score</p>
          </div>
          <div className="stat-card">
            <h3>95+</h3>
            <p>Messages from AI Chatbot</p>
          </div>
          <div className="stat-card">
            <h3>1875+</h3>
            <p>Refill for Medications</p>
          </div>
        </section>

        <section className="appointments-section">
          <h3>Your Appointments</h3>
          <div className="appointments">
            {appointments.length > 0 ? ( // Check if there are any appointments
              appointments.map((appointment) => (
                <div className="appointment" key={appointment.id}>
                  <p><strong>Doctor:</strong> {appointment.username}</p>
                  <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                </div>
              ))
            ) : (
              <p>No appointments found.</p> // Message if no appointments
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;
