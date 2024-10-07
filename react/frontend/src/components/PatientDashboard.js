import React, { useEffect, useState } from 'react';
import './patientDashboard.css'; // Create this file for custom styles
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
    const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');

  // Retrieve the userId from local storage (or state management)
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username'); // Assuming you stored userId in local storage
    if (storedUserId) {
      setUserId(storedUserId);
      fetchAppointments(storedUserId);
    }
  
  if (storedUsername) {
    setUsername(storedUsername); // Set username from local storage
  }
}, []);

  const fetchAppointments = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/user/patientDashboard`, {
        method: 'GET',
        headers: {
          'userId': id, // Include userId in headers
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data); // Assuming the API returns a list of appointments
      } else {
        console.error('Failed to fetch appointments:', response.statusText);
      }
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
          <li onClick={() => navigate('/PatientDashboard')}>Dashboard</li> {/* Navigate to dashboard */}
          <li onClick={handleNavigateToAppointments}>Appointments</li> {/* Navigate to appointments */}
            <li>Prescription</li>
            <li>Medical Tests</li>
            <li>Health Records</li>
            <li>Wellness Chatbot</li>
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
            {appointments.map((appointment) => (
              <div className="appointment" key={appointment.id}>
                <p>{appointment.description}</p>
                <span>{appointment.appointmentTime}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;

