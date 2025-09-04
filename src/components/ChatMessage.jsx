import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const { text, isAi, timestamp } = message;
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message ${isAi ? 'ai-message' : 'user-message'}`}>
      <div className="message-content">
        <div className="message-avatar">
          {isAi ? '🤖' : '👤'}
        </div>
        <div className="message-bubble">
          <p className="message-text">{text}</p>
          <span className="message-time">{formatTime(timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
