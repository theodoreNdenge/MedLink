import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import DoctorDashboard from './components/DoctorDashboard'
import PatientDashboard from './components/PatientDashboard'
import Appointments from './components/Appointments'
import DoctorAppointments from './components/DoctorAppointments';
import WELLnessbot from './components/wellnessBot';
import Messages from './components/Messages';
import HealthRecordUpload from './components/HealthRecordUpload';
import UserProfile from './components/UserProfile';
import DoctorMessages from './components/DoctorMessages';

const App = () => {
    const role = localStorage.getItem('role'); // Get the role from local storage
    const userId = localStorage.getItem('userId');
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
                <Route path="/wellness-bot" element={<WELLnessbot />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/health-records" element={<HealthRecordUpload  userId={userId}/>} />
                <Route path="/userProfile" element={<UserProfile  />} />
                <Route path="/DoctorAppointments" element={<DoctorAppointments />} />
                <Route path="/DoctorMessages" element={<DoctorMessages />} />
              
                {/* Fallback route for unknown paths */}
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
           
        </Router>
    );
};

export default App;