import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register'; // Adjust the path based on your file structure
import Login from './Login';       // Adjust the path based on your file structure
import ScheduleAppointment from './ScheduleAppointment'; // Adjust the path based on your file structure
import SendMessage from './SendMessage'; // Adjust the path based on your file structure

const App = () => {
    return (
        <Router>
            <div>
                <h2>Welcome to the Telemedicine App!</h2>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/schedule" element={<ScheduleAppointment />} />
                    <Route path="/send-message" element={<SendMessage />} />
                    <Route path="/"  /> {/* Add a Home component if needed */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
