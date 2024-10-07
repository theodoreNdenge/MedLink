import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import DoctorDashboard from './components/DoctorDashboard'
import PatientDashboard from './components/PatientDashboard'
import Appointments from './components/Appointments'
import DoctorAppointments from './components/DoctorAppointments';

const App = () => {
    const role = localStorage.getItem('role'); // Get the role from local storage
    return (
        <Router>
          
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} /> {/* Placeholder for login page */}
                {/* Role-based dashboard routing */}
                {role === 'patient' && <Route path="/PatientDashboard" element={<PatientDashboard />} />}
                {role === 'doctor' && <Route path="/DoctorDashboard" element={<DoctorDashboard />} />}
                <Route path="/Appointments" element={<Appointments />} />
                <Route path="/DoctorAppointments" element={<DoctorAppointments />} />
                {/* Fallback route for unknown paths */}
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
           
        </Router>
    );
};

export default App;