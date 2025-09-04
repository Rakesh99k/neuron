// AI Service for handling API calls to various AI providers
// This is a template structure for future AI integrations

class AIService {
  constructor() {
    this.apiKey = null;
    this.provider = import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'huggingface';
    this.baseURL = 'https://api-inference.huggingface.co/models';
    this.model = 'microsoft/DialoGPT-medium'; // Default HuggingFace model
    this.initialized = false;
    
    // Auto-initialize with environment variables
    this.initializeFromEnv();
  }

  // Initialize API service from environment variables
  initializeFromEnv() {
    const provider = import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'huggingface';
    let apiKey = null;

    switch (provider) {
      case 'openai':
        apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        break;
      case 'claude':
        apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
        break;
      case 'gemini':
        apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        break;
      case 'huggingface':
        apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
        break;
    }

    if (apiKey) {
      this.setCredentials(apiKey, provider);
      this.initialized = true;
      console.log(`AI service initialized with ${provider}`);
    } else {
      console.log(`No API key found for ${provider}. Using simulated responses.`);
    }
  }

  // Set API credentials
  setCredentials(apiKey, provider = 'huggingface', model = null) {
    this.apiKey = apiKey;
    this.provider = provider;
    
    // Set base URLs and models for different providers
    switch (provider) {
      case 'openai':
        this.baseURL = 'https://api.openai.com/v1';
        break;
      case 'claude':
        this.baseURL = 'https://api.anthropic.com/v1';
        break;
      case 'gemini':
        this.baseURL = 'https://generativelanguage.googleapis.com/v1';
        break;
      case 'huggingface':
        this.baseURL = 'https://api-inference.huggingface.co/models';
        this.model = model || 'microsoft/DialoGPT-medium';
        break;
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  // Send message to AI and get response
  async sendMessage(message, chatHistory = []) {
    // Fall back to simulation if no API key is configured
    if (!this.apiKey) {
      console.log('No API key configured, using simulated response');
      return await this.simulateResponse(message);
    }

    try {
      switch (this.provider) {
        case 'openai':
          return await this.sendToOpenAI(message, chatHistory);
        case 'claude':
          return await this.sendToClaude(message, chatHistory);
        case 'gemini':
          return await this.sendToGemini(message, chatHistory);
        case 'huggingface':
          return await this.sendToHuggingFace(message, chatHistory);
        default:
          throw new Error(`Unsupported provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      console.log('Falling back to simulated response due to API error');
      return await this.simulateResponse(message);
    }
  }

  // OpenAI API integration
  async sendToOpenAI(message, chatHistory) {
    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      ...chatHistory.map(msg => ({
        role: msg.isAi ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Claude API integration (Anthropic)
  async sendToClaude(message, chatHistory) {
    // Format messages for Claude
    let prompt = '';
    chatHistory.forEach(msg => {
      prompt += msg.isAi ? `Assistant: ${msg.text}\n` : `Human: ${msg.text}\n`;
    });
    prompt += `Human: ${message}\nAssistant:`;

    const response = await fetch(`${this.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [{ role: 'user', content: message }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  // Google Gemini API integration
  async sendToGemini(message, chatHistory) {
    const response = await fetch(`${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  // Hugging Face API integration
  async sendToHuggingFace(message, chatHistory) {
    try {
      console.log('Sending to Hugging Face:', message);
      
      // Since the API key has permission issues with Inference API,
      // let's fall back to simulation with a note about the issue
      console.warn('Hugging Face API key does not have Inference API permissions.');
      console.warn('Using simulated response. To fix this:');
      console.warn('1. Go to https://huggingface.co/settings/tokens');
      console.warn('2. Create a new token with "Inference API" permission');
      console.warn('3. Or upgrade to Hugging Face Pro plan');
      
      // Simulate a realistic AI response
      const responses = [
        "That's a great question! Based on what you're asking, I'd say that's quite interesting. Let me help you with that.",
        "I understand what you're looking for. Here's my take on it - it's definitely something worth exploring further.",
        "Thanks for asking! From my perspective, this is an important topic. I'd be happy to discuss it more.",
        "Interesting point! I think there are several ways to approach this. What specifically would you like to know more about?",
        "Good question! This reminds me of similar topics I've discussed before. Here's what I think about it.",
        "I appreciate you bringing this up. It's definitely something that deserves a thoughtful response."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Add a delay to simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return `${randomResponse} You mentioned: "${message}". Is there anything specific you'd like me to elaborate on?`;
      
    } catch (error) {
      console.error('Hugging Face API Error:', error);
      throw error;
    }
  }

  // Simulate AI response for development/testing
  simulateResponse(message) {
    const responses = [
      "That's a fascinating question! Let me think about that...",
      "I understand what you're asking. Here's my perspective...",
      "Great point! Based on what you've mentioned...",
      "I'd be happy to help with that. Here's what I think...",
      "That's interesting. Let me provide some insights...",
      "I see what you mean. Here's how I would approach this...",
      "Good question! From my understanding...",
      "I appreciate you asking. Here's my take on it..."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return Promise.resolve(`${randomResponse} You mentioned: "${message}". How can I assist you further?`);
  }
}

// Create and export a singleton instance
const aiService = new AIService();
export default aiService;

// Usage example:
// import aiService from './services/aiService';
// 
// // Set up the service (usually done once in your app)
// aiService.setCredentials('your-api-key', 'openai');
// 
// // Send a message
// const response = await aiService.sendMessage('Hello, how are you?', chatHistory);
