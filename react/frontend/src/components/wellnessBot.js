import React, { useState } from 'react';
import './wellnessBot.css';  // Ensure your CSS file includes the new styles
import { useNavigate } from 'react-router-dom';

const WELLnessbot = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]); // State to keep track of messages
  const navigate = useNavigate();

  // Function to handle sending the question to the wellness bot
  const handleSendQuestion = async () => {
    if (question.trim() === '') {
      alert('Please enter a question.');
      return;
    }

    // Add user message to the messages array
    setMessages(prevMessages => [...prevMessages, { text: question, sender: 'user' }]);

    try {
      const res = await fetch(`http://localhost:8080/user/answer?question=${encodeURIComponent(question)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const data = await res.text();
      // Add bot response to the messages array
      setMessages(prevMessages => [...prevMessages, { text: data, sender: 'bot' }]);
      setQuestion(''); // Clear the input field
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Failed to fetch the response from the wellness bot.', sender: 'bot' }]);
    }
  };

  const handleNavigateToAppointments = () => {
    navigate('/appointments');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2> WELLNESS BOT</h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/PatientDashboard')}>Dashboard</li>
            <li onClick={handleNavigateToAppointments}>Appointments</li>
            <li>Prescription</li>
            <li onClick={() => navigate('/messages')}>Messages</li>
            <li>Health Records</li>
            <li onClick={() => navigate('/wellness-bot')}>Wellness Chatbot</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <div className="wellness-bot-container">
          <h2><i className="fas fa-comments"></i> Wellness Bot</h2>
          <div className="chat-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
            />
            <button onClick={handleSendQuestion}>Send</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WELLnessbot;
