import { useState } from 'react';
import aiService from '../services/aiService';
import './ConfigModal.css';

const ConfigModal = ({ isOpen, onClose, onConfigUpdate }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    try {
      // Set the credentials (Gemini only)
      aiService.setCredentials(apiKey);
      aiService.initialized = true;
      
      // Test the connection
      await aiService.sendMessage('Hello', []);
      
      onConfigUpdate();
      onClose();
      
      // Clear the form
      setApiKey('');
    } catch (error) {
      alert('Failed to connect with the provided API key. Please check your key and try again.');
      console.error('Config error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="config-modal-overlay" onClick={onClose}>
      <div className="config-modal" onClick={(e) => e.stopPropagation()}>
        <div className="config-modal-header">
          <h3>🔧 Configure Gemini</h3>
          <button className="config-modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="config-form">
          <div className="form-group">
            <label htmlFor="apiKey">Gemini API Key:</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key here..."
              className="form-input"
              required
            />
          </div>

          <div className="form-help">
            <p>Get your Gemini API key from:</p>
            <ul>
              <li><strong>Google AI Studio:</strong> <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">aistudio.google.com/app/apikey</a></li>
            </ul>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading || !apiKey.trim()}
            >
              {isLoading ? 'Testing...' : 'Save & Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;
