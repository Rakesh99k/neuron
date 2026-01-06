import { useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ConfigModal from './ConfigModal';
import aiService from '../services/aiService';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?\n\nTip: Click the ⚙️ icon to configure your AI provider and add an API key. Without a key, I’ll reply in demo mode.",
      isAi: true,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [configKey, setConfigKey] = useState(0); // Force re-render when config changes

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isAi: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response using the AI service
      const aiResponseText = await aiService.sendMessage(messageText, messages);
      
      const aiResponse = {
        id: Date.now() + 1,
        text: aiResponseText,
        isAi: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Show error message to user
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isAi: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigUpdate = () => {
    setConfigKey(prev => prev + 1); // Force re-render to update status
  };


  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <div className="header-text">
            <h2>🤖 AI Assistant</h2>
            <p>Ask me anything!</p>
            <div className="ai-provider-status" key={configKey}>
              {aiService.initialized 
                ? `Powered by ${aiService.provider}` 
                : 'Demo mode - Add API key for full functionality'
              }
            </div>
          </div>
          <button 
            className="config-button" 
            onClick={() => setShowConfig(true)}
            title="Configure AI Provider"
          >
            ⚙️
          </button>
        </div>
      </div>
      
      <div className="chatbot-messages">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
          />
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>AI is typing...</span>
          </div>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      
      <ConfigModal 
        isOpen={showConfig} 
        onClose={() => setShowConfig(false)}
        onConfigUpdate={handleConfigUpdate}
      />
    </div>
  );
};

export default Chatbot;
