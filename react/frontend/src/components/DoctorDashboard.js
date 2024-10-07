import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctorDashboard.css'; // Create this file for custom styles

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        fetchAppointments();
        fetchMessages();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/doctor/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:8080/doctor/messages');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/doctor/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>Doctor Dashboard</h2>
                <nav>
                    <ul>
                        <li>Appointments</li>
                        <li>Messages</li>
                        <li>Patients</li>
                        <li>Settings</li>
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
                        {appointments.map((appointment) => (
                            <div className="appointment" key={appointment.id}>
                                <p>{appointment.description}</p>
                                <span>{appointment.appointmentTime}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="messages-section">
                    <h3>Messages</h3>
                    <div className="messages">
                        {messages.map((message) => (
                            <div className="message" key={message.id}>
                                <p>{message.content}</p>
                                <span>{message.sender}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="patients-section">
                    <h3>Your Patients</h3>
                    <div className="patients">
                        {patients.map((patient) => (
                            <div className="patient" key={patient.id}>
                                <p>{patient.name}</p>
                                <span>{patient.email}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DoctorDashboard;
