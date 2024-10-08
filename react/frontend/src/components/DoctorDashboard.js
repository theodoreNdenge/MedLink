import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './doctorDashboard.css'; // Create this file for custom styles

const DoctorDashboard = () => {
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
        const response = await axios.get(`http://localhost:8080/user/doctorAppointment/${id}`); // Use the correct endpoint
        setAppointments(response.data); // Assuming the API returns a list of appointments
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
  
    const handleNavigateToAppointments = () => {
      navigate('/DoctorDashboard'); // Use navigate to go to the Appointments page
    };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Doctor Dashboard</h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/DoctorAppointments')}>Appointments</li>
            <li onClick={() => navigate('/DoctorMessages')}>Messages</li>
            <li onClick={() => navigate('/')}>Patients</li>
            <li onClick={() => navigate('/')}>Settings</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>Welcome, Dr {username}!</h2>
        </header>

        <section className="appointments-section">
          <h3>Your Appointments</h3>
          <div className="appointments">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div className="appointment" key={appointment.id}>
                  <p><strong>Patient Name:</strong> {appointment.patientName}</p>
                  <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                </div>
              ))
            ) : (
              <p>No appointments scheduled.</p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default DoctorDashboard;


