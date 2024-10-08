import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Appointments.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(''); 
  const [appointmentDate, setAppointmentDate] = useState(''); // Renamed from appointmentDate to appointmentTime
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/listDoctors');
      console.log('Doctors fetched:', response.data);

      if (Array.isArray(response.data)) {
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearch = () => {
    const filtered = doctors.filter(doctor => {
      const name = doctor.username ? doctor.username.toLowerCase() : '';
      const specialization = doctor.specialization ? doctor.specialization.toLowerCase() : '';
      return name.includes(searchTerm.toLowerCase()) || specialization.includes(searchTerm.toLowerCase());
    });
    setFilteredDoctors(filtered);
  };

  const scheduleAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
    setSuccessMessage(''); // Reset success message
    setErrorMessage(''); // Reset error message
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const userId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const url = `http://localhost:8080/user/scheduleAppointment?patientId=${userId}`;

    // Combine the appointment date and time into a single Date object
    const selectedDate = new Date(`${appointmentDate}T${appointmentTime}`);

    // Check if the selected date is in the past
    if (selectedDate < new Date()) {
        setErrorMessage(' Date has already passed , please Enter valid date'); // Set error message
        setSuccessMessage(''); // Reset success message
        return; // Exit the function to prevent form submission
    }

    const Userdata = {
        doctorId: selectedDoctor.id,
        appointmentTime, // Changed to appointmentTime to match backend
        patientId: userId, // Include the patient ID in the request
        status: 'scheduled',
        appointmentDate: selectedDate.toISOString(), // Use appointmentDate here
        doctorName: selectedDoctor.username,
        patientName: storedUsername
    };

    try {
        // Make the API request to schedule the appointment
        const response = await axios.post(url, Userdata);

        console.log('Appointment scheduled:', response.data);
        alert('Appointment scheduled successfully!');
        setSuccessMessage('Appointment scheduled successfully!'); // Set success message
        setErrorMessage(''); // Reset error message

        // Close the modal and reset fields
        setIsModalOpen(false);
        setAppointmentTime(''); // Reset appointment time
        setAppointmentDate(''); // Reset appointment date
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        setErrorMessage('Doctor is not available at selected time,  Please try again.'); // Set error message
        setSuccessMessage(''); // Reset success message
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
            <li  onClick={() => navigate('/health-records')}>Health Records</li>
            <li onClick={() => navigate('/messages')} >Messages</li>
            <li onClick={() => navigate('/wellness-bot')}>Wellness Chatbot</li>
            <li onClick={() => navigate('/userProfile')}>Settings</li>
          </ul>
        </nav>
      </aside>

      <div className="appointments-container">
        <h2>Search for Doctors</h2>
        <div>
          <input
            type="text"
            placeholder="Enter specialization or name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <main className="main-content">
          <h3>Available Doctors:</h3>
          <div className="doctors-list">
            {filteredDoctors.length > 0 ? (
              <div>
                {filteredDoctors.map(doctor => (
                  <div className="doctor-card" key={doctor.id}>
                    <div className="doctor-info">
                      <strong>Doctor Name:</strong> {doctor.username}
                    </div>
                    <div className="doctor-info">
                      <strong>Specialization:</strong> {doctor.specialization}
                    </div>
                    <button 
                      className="schedule-btn" 
                      onClick={() => scheduleAppointment(doctor)} // Pass the entire doctor object
                    >
                      Schedule Appointment
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No doctors available</p>
            )}
          </div>
        </main>

        {/* Modal for scheduling appointment */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Schedule Appointment with {selectedDoctor?.username}</h3>
              <form onSubmit={handleAppointmentSubmit}>
              Appointment Date:
          <input 
            type="date" 
            value={appointmentDate} // Access date from appointmentTime
            onChange={(e) => setAppointmentDate( e.target.value)}
            required 
          />
                <label>
                  Appointment Time:
                  <input 
                    type="time" name="appointment-time" 
                    value={appointmentTime} // Use appointmentTime here
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

export default Appointments;
