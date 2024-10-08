import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Messages.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false); // State for chat modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatMessages, setChatMessages] = useState([]); // State for chat messages
  const [newMessage, setNewMessage] = useState(''); // State for new message input
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

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

  const openChat = (doctor) => {
    setSelectedDoctor(doctor);
    setChatMessages([]); // Reset chat messages
    fetchChatMessages(doctor.id); // Fetch previous messages for the selected doctor
    setIsChatModalOpen(true);
  };

  const fetchChatMessages = async (recipientId) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/getMessages?recipientId=${recipientId}`);
      if (Array.isArray(response.data)) {
        setChatMessages(response.data); // Set fetched messages
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const messageData = {
      senderId: userId,
      recipientId: selectedDoctor.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post('http://localhost:8080/user/sendMessage', messageData);
      setNewMessage(''); // Clear the input field
      setChatMessages((prevMessages) => [...prevMessages, messageData]); // Add the new message to the state
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Appointments</h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/PatientDashboard')}>Dashboard</li>
            <li onClick={() => navigate('/Appointments')}>Appointments</li>
            <li>Prescription</li>
            <li onClick={() => navigate('/messages')}>Messages</li>
            <li>Health Records</li>
            <li onClick={() => navigate('/wellness-bot')}>Wellness Chatbot</li>
            <li>Settings</li>
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
                      onClick={() => openChat(doctor)} // Open chat modal
                    >
                      Send Message
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No doctors available</p>
            )}
          </div>
        </main>

        {/* Modal for chat */}
        {isChatModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Chat with Dr. {selectedDoctor?.username}</h3>
              <div className="chat-container">
                <div className="messages">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
                      <span>{msg.content}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="chat-input">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    required 
                  />
                  <button type="submit">Send</button>
                </form>
              </div>
              <button type="button" onClick={() => setIsChatModalOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
