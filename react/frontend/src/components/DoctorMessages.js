import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Messages.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const DoctorMessages = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false); // State for chat modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatMessages, setChatMessages] = useState([]); // State for chat messages
  const [newMessage, setNewMessage] = useState(''); // State for new message input
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, patients]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/listPatients');
      console.log('Patients fetched:', response.data);

      if (Array.isArray(response.data)) {
        setPatients(response.data);
        setFilteredPatients(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearch = () => {
    const filtered = patients.filter(patient => {
      const name = patient.username ? patient.username.toLowerCase() : '';
      return name.includes(searchTerm.toLowerCase());
    });
    setFilteredPatients(filtered);
  };

  const openChat = (patient) => {
    setSelectedPatient(patient);
    fetchChatMessages(patient.patientId); // Fetch previous messages for the selected doctor
    setIsChatModalOpen(true);
  };

  const fetchChatMessages = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/messages?recipientId=${userId}`);
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
      recipientId: selectedPatient.id,
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
            <li onClick={() => navigate('/DoctorDashboard')}>Dashboard</li>
            <li onClick={() => navigate('/DoctorDashboard')}>Appointments</li>
            <li>Prescription</li>
            <li onClick={() => navigate('/DoctorMessages')}>Messages</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      <div className="appointments-container">
        <h2>Search for Patients</h2>
        <div>
          <input
            type="text"
            placeholder="Enter Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <main className="main-content">
          <h3>List of Patients</h3>
          <div className="doctors-list">
            {filteredPatients.length > 0 ? (
              <div>
                {filteredPatients.map(patient => (
                  <div className="doctor-card" key={patient.id}>
                    <div className="doctor-info">
                      <strong>Patient Name:</strong> {patient.username}
                    </div>
                    <div className="doctor-info">

                    </div>
                    <button 
                      className="schedule-btn" 
                      onClick={() => openChat(patient)} // Open chat modal
                    >
                      Send Message
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No patients available</p>
            )}
          </div>
        </main>

        {/* Modal for chat */}
        {isChatModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Chat with Patient, {selectedPatient?.username}</h3>
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

export default DoctorMessages;


