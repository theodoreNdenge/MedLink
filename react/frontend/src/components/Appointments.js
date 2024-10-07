import React, { useState } from 'react';
import axios from 'axios';
import './Appointments.css'; // Import the CSS file

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const specialization = document.getElementById('specialization').value;

  const fetchDoctors = async () => {
    try {
      const response = await axios.post('http://localhost:8080/user/searchDoctors', {
        specialization: specialization
      });
      console.log('Response:', response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error searching for doctors:', error);
    }
  };

  const handleSearch = () => {
    fetchDoctors();
  };

  return (
    <div className="appointments-container">
      <h2>Search for Doctors</h2>
      <div>
        <input
          type="text"
          placeholder="Enter specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h3>Available Doctors:</h3>
      <ul>
        {doctors.map(doctor => (
          <li key={doctor.id}>
            <p>{doctor.name} - {doctor.specialization}</p>
            <button onClick={() => scheduleAppointment(doctor.id)}>Schedule Appointment</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const scheduleAppointment = (doctorId) => {
  // Implement your appointment scheduling logic here
  console.log(`Scheduling appointment with doctor ID: ${doctorId}`);
};

export default Appointments;
