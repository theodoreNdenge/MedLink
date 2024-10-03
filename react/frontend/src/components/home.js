import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <img src="/images/img2.jpg" alt="Background" className="background-image" />
            <div className="button-container">
                <button className="home-button" onClick={() => navigate('/login')}>Login</button>
                <button className="home-button" onClick={() => navigate('/sign-up')}>Sign Up</button>
            </div>
        </div>
    );
};

export default Home;