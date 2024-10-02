import React, { useState } from 'react';
import axios from 'axios';

const SendMessage = () => {
    const [senderId, setSenderId] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [content, setContent] = useState('');
    const [timestamp, setTimestamp] = useState(new Date().toISOString());

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/user/sendMessage', {
                senderId,
                recipientId,
                content,
                timestamp
            });
            alert('Message sent successfully!');
        } catch (error) {
            alert('Failed to send message: ' + error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Send Message</h2>
            <input type="text" placeholder="Sender ID" value={senderId} onChange={(e) => setSenderId(e.target.value)} required />
            <input type="text" placeholder="Recipient ID" value={recipientId} onChange={(e) => setRecipientId(e.target.value)} required />
            <textarea placeholder="Message" value={content} onChange={(e) => setContent(e.target.value)} required />
            <button type="submit">Send Message</button>
        </form>
    );
};

export default SendMessage;
