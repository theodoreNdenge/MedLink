import React, { useState } from 'react';
import axios from 'axios';

const ScheduleAppointment = () => {
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [status, setStatus] = useState('scheduled');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/user/scheduleAppointment', {
                patientId,
                doctorId,
                appointmentTime,
                status
            });
            alert('Appointment scheduled successfully!');
        } catch (error) {
            alert('Failed to schedule appointment: ' + error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Schedule Appointment</h2>
            <input type="text" placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
            <input type="text" placeholder="Doctor ID" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required />
            <input type="datetime-local" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required />
            <button type="submit">Schedule Appointment</button>
        </form>
    );
};

export default ScheduleAppointment;
