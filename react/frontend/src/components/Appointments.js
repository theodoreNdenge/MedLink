import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Appointments.css'; // Import the CSS file

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/doctors'); // Adjust the API endpoint as needed
      setDoctors(response.data);
      setFilteredDoctors(response.data); // Initialize filtered doctors with all doctors
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearch = () => {
    const filtered = doctors.filter(doctor =>
      doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
    );
    setFilteredDoctors(filtered);
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
        {filteredDoctors.map(doctor => (
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
