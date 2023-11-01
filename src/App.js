import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
const socket = io('https://chat-x7zw.onrender.com/');

function App() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const getUserInput = () => {
      const user = prompt('Enter your name:');
      if (user) {
        setUsername(user);
        socket.emit('Msg', `User ${user} joined the chat.`);
      } else {
        alert('You must enter a name.');
        getUserInput();
      }
    };

    getUserInput();

    socket.on('Msg', handleReceivedMessage);

    return () => {
      socket.off('Msg', handleReceivedMessage);
      socket.disconnect();
    };
  }, []);

  const handleReceivedMessage = (msg) => {
    const sender = msg.split(':')[0].trim();
    const newMessage = { text: msg, user: sender === username ? 'user' : 'other' };
  
    if (!receivedMessages.some(m => m.text === newMessage.text)) {
      setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };
  
  
  const handleSendMessage = () => {
    const newMessage = { text: `${username}: ${message}`, user: 'user' };
    setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit('Msg', newMessage.text);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat Application</h2>
      <div className='chatme'>
        <img src='https://tse3.mm.bing.net/th?id=OIP.QS6R2MeeiAOTOvWYTkIrngAAAA&pid=Api&P=0&h=180' alt="chat-icon" />
        <h1>Welcome {username}!!</h1>
        <div style={{ overflowY: 'scroll', height: '460px' }}>
          {receivedMessages.map((msg, index) => (
            <div
              key={index}
              className={msg.user === 'user' ? 'right-message' : 'left-message'}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className='inputf'>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
