import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorAppointments.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const fetchDoctorAppointments = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get('http://localhost:8080/user/doctorAppointments', {
        headers: { userId: userId }
      });

      // Check if the response contains the appointments array
      if (response.data && response.data.appointments) {
        setAppointments(response.data.appointments);
      } else {
        console.error('Unexpected response format:', response.data);
        setErrorMessage('Error fetching appointments.');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setErrorMessage('Error fetching appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const scheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
    setSuccessMessage(''); // Reset success message
    setErrorMessage(''); // Reset error message
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const userId = localStorage.getItem('userId');
    const url = `http://localhost:8080/user/appointment/${userId}`;

    // Combine the appointment date and time into a single Date object
    const selectedDate = new Date(`${appointmentDate}T${appointmentTime}`);

    // Check if the selected date is in the past
    if (selectedDate < new Date()) {
      setErrorMessage('Date has already passed, please enter a valid date');
      setSuccessMessage('');
      return;
    }

    const appointmentData = {
      doctorId: selectedAppointment.doctorId, // Ensure correct mapping
      appointmentTime,
      patientId: userId,
      status: 'scheduled',
      appointmentDate: selectedDate.toISOString(),
    };

    try {
      const response = await axios.post(url, appointmentData);
      console.log('Appointment scheduled:', response.data);
      setSuccessMessage('Appointment scheduled successfully!');
      setErrorMessage('');
      setIsModalOpen(false);
      setAppointmentTime('');
      setAppointmentDate('');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      setErrorMessage('Error scheduling appointment. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="doctor-appointments-container">
      <aside className="sidebar">
        <h2>Appointments</h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/DoctorDashboard')}>Dashboard</li>
            <li>Appointments</li>
            <li>Prescription</li>
            <li>Messages</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <div className="appointments-content">
        <h2>My Appointments</h2>
        {loading ? (
          <p>Loading appointments...</p>
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : appointments.length === 0 ? (
          <p>No appointments available.</p>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.patientId}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td>{new Date(`1970-01-01T${appointment.appointmentTime}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <button onClick={() => scheduleAppointment(appointment)}>Schedule</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal for scheduling appointment */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Schedule Appointment</h3>
              <form onSubmit={handleAppointmentSubmit}>
                <label>
                  Appointment Date:
                  <input 
                    type="date" 
                    value={appointmentDate} 
                    onChange={(e) => setAppointmentDate(e.target.value)} 
                    required 
                  />
                </label>
                <label>
                  Appointment Time:
                  <input 
                    type="time" 
                    value={appointmentTime} 
                    onChange={(e) => setAppointmentTime(e.target.value)} 
                    required 
                  />
                </label>
                <button type="submit">Confirm Appointment</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </form>
              {successMessage && <p className="success-message">{successMessage}</p>}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
