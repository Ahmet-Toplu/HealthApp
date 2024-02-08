import React, { useState } from 'react';
import axios from 'axios';

export const ChatBotPage = () => {
    const [userMessage, setUserMessage] = useState('');
    const [conversation, setConversation] = useState([]);

    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        const newConversation = [...conversation, { text: userMessage, sender: 'user' }];
        setConversation(newConversation);
        setUserMessage('');

        try {
            const response = await axios.post('http://localhost:8081/chatbot', { message: userMessage });
            const botReply = response.data.reply;
            setConversation([...newConversation, { text: botReply, sender: 'bot' }]);
        } catch (error) {
            console.error('Error sending message to bot:', error);
            setConversation([...newConversation, { text: 'Error talking to the bot. Please try again later.', sender: 'bot' }]);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="conversation-view">
                {conversation.map((messageObj, index) => (
                    <div key={index} className={`message ${messageObj.sender}`}>
                        {messageObj.text}
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message here..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};
