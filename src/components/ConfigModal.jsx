import { useState } from 'react';
import aiService from '../services/aiService';
import './ConfigModal.css';

const ConfigModal = ({ isOpen, onClose, onConfigUpdate }) => {
  const [provider, setProvider] = useState(aiService.provider);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    try {
      // Set the credentials
      aiService.setCredentials(apiKey, provider);
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
          <h3>🔧 Configure AI Provider</h3>
          <button className="config-modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="config-form">
          <div className="form-group">
            <label htmlFor="provider">AI Provider:</label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="form-select"
            >
              <option value="huggingface">Hugging Face</option>
              <option value="openai">OpenAI (GPT)</option>
              <option value="claude">Anthropic (Claude)</option>
              <option value="gemini">Google (Gemini)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="apiKey">API Key:</label>
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
            <p>Get your API key from:</p>
            <ul>
              <li><strong>Hugging Face:</strong> <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer">huggingface.co/settings/tokens</a></li>
              <li><strong>OpenAI:</strong> <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a></li>
              <li><strong>Anthropic:</strong> <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">console.anthropic.com</a></li>
              <li><strong>Google:</strong> <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">makersuite.google.com/app/apikey</a></li>
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
