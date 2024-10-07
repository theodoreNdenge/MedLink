import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './doctorDashboard.css'; // Create this file for custom styles

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [patients, setPatients] = useState([]);

  // Fetch appointments, messages, and patients on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get user ID from local storage
        
        // Fetch appointments for the doctor
        const appointmentsResponse = await axios.get('http://localhost:8080/user/doctorAppointments', {
          headers: { 'userId': userId }
        });
        setAppointments(appointmentsResponse.data);

        // Fetch messages (assuming an endpoint exists for this)
        const messagesResponse = await axios.get('http://localhost:8080/user/messages', {
          headers: { 'userId': userId }
        });
        setMessages(messagesResponse.data);

        // Fetch patients (assuming an endpoint exists for this)
        const patientsResponse = await axios.get(`http://localhost:8080/user/patients`, {
          headers: { 'userId': userId }
        });
        setPatients(patientsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Doctor Dashboard</h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/DoctorAppointments')}>Appointments</li>
            <li onClick={() => navigate('/Messages')}>Messages</li>
            <li onClick={() => navigate('/Patients')}>Patients</li>
            <li onClick={() => navigate('/Settings')}>Settings</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>Welcome, Doctor!</h2>
        </header>

        <section className="appointments-section">
          <h3>Your Appointments</h3>
          <div className="appointments">
            {appointments.length > 0 ? (
              appointments.map((appointments) => (
                <div className="appointment" key={appointments.id}>
                  <p>{appointments.patientId}</p> {/* Assuming patientId is being used */}
                  <span>{appointments.appointmentTime}</span>
                </div>
              ))
            ) : (
              <p>No appointments scheduled.</p>
            )}
          </div>
        </section>

        <section className="messages-section">
          <h3>Your Messages</h3>
          <div className="messages">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div className="message" key={message.id}>
                  <p>{message.content}</p>
                  <span>{message.timestamp}</span>
                </div>
              ))
            ) : (
              <p>No messages available.</p>
            )}
          </div>
        </section>

        <section className="patients-section">
          <h3>Your Patients</h3>
          <div className="patients">
            {patients.length > 0 ? (
              patients.map((patient) => (
                <div className="patient" key={patient.id}>
                  <p>{patient.username}</p> {/* Assuming patient username is available */}
                </div>
              ))
            ) : (
              <p>No patients assigned.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DoctorDashboard;

