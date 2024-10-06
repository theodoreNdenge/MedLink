import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} /> {/* Placeholder for login page */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;