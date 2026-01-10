// AI Service for handling API calls (Gemini only)

const SYSTEM_PROMPT = [
  'You are Neuron, an ultra-productive React/JS coding assistant.',
  'Goals: solve proactively, be concise, give executable steps and code.',
  'Tone: direct, friendly, slightly witty when appropriate.',
  'Safety: no harmful, copyrighted, or insecure content.',
  'Reply with concrete, actionable answers: numbered steps, code blocks, and specific changes.',
].join('\n');

class AIService {
  constructor() {
    this.apiKey = null;
    this.provider = 'gemini';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1';
    this.model = 'gemini-2.5-flash';
    this.initialized = false;
    this.generationConfig = {
      temperature: 0.2,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    };
    
    // Auto-initialize with environment variables
    this.initializeFromStorage();
    this.initializeFromEnv();
  }

  // Persist to localStorage
  initializeFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem('neuron.ai.config') || '{}');
      if (saved && saved.apiKey) {
        this.setCredentials(saved.apiKey, 'gemini', saved.model || this.model);
        if (saved.generationConfig) this.setGenerationConfig(saved.generationConfig);
        this.initialized = true;
        console.log('AI service initialized from saved config');
      }
    } catch (e) {
      console.warn('Failed to read saved AI config', e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('neuron.ai.config', JSON.stringify({
        apiKey: this.apiKey,
        model: this.model,
        generationConfig: this.generationConfig,
      }));
    } catch (e) {
      console.warn('Failed to save AI config', e);
    }
  }

  // Initialize API service from environment variables
  initializeFromEnv() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      this.setCredentials(apiKey);
      this.initialized = true;
      console.log('AI service initialized with gemini');
    } else {
      console.log('No Gemini API key found. Using simulated responses.');
    }
  }

  // Set API credentials
  setCredentials(apiKey, _provider = 'gemini', model = null) {
    this.apiKey = apiKey;
    this.provider = 'gemini';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1';
    if (model) this.model = model;
    this.saveToStorage();
  }

  // Update generation parameters
  setGenerationConfig(config = {}) {
    this.generationConfig = { ...this.generationConfig, ...config };
    this.saveToStorage();
  }

  // Send message to AI and get response
  async sendMessage(message, chatHistory = []) {
    // Fall back to simulation if no API key is configured
    if (!this.apiKey) {
      console.log('No API key configured, using simulated response');
      return await this.simulateResponse(message);
    }

    try {
      return await this.sendToGemini(message, chatHistory);
    } catch (error) {
      console.error('AI Service Error:', error);
      console.log('Falling back to simulated response due to API error');
      return await this.simulateResponse(message);
    }
  }

  // Google Gemini API integration
  async sendToGemini(message, chatHistory) {
    // Build conversation contents from history
    const contents = [];

    // Include past turns if available
    if (Array.isArray(chatHistory) && chatHistory.length) {
      for (const m of chatHistory) {
        const role = m.isAi ? 'model' : 'user';
        contents.push({ role, parts: [{ text: m.text }] });
      }
    }

    // Append current user turn
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await fetch(`${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          role: 'system',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        generationConfig: this.generationConfig,
      }),
    });

    if (!response.ok) {
      let errorDetail = '';
      try {
        const text = await response.text();
        errorDetail = text;
      } catch (_) {
        // ignore parse errors
      }
      console.error('Gemini API error detail:', errorDetail);
      throw new Error(`Gemini API error ${response.status}${errorDetail ? `: ${errorDetail}` : ''}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text && text.trim() ? text : 'I could not generate a useful response. Try rephrasing or adding details.';
  }

  // Simulate AI response for development/testing
  simulateResponse(message) {
    const tip = 'Demo mode: add your Gemini API key in the ⚙️ menu for precise, code-rich answers.';

    const lower = (message || '').toLowerCase();
    const isError = /error|exception|fail|bug|stack/i.test(message);
    const wantsCode = /code|implement|add|create|snippet|function|component/i.test(message);

    if (isError) {
      const body = [
        `Issue: "${message}"`,
        '',
        'Diagnostics:',
        '- Reproduce and capture exact error text and context.',
        '- Check recent changes and dependency versions.',
        '- Inspect logs and browser devtools network/console.',
        '',
        'Next Steps:',
        '1) Share the error output and related file paths.',
        '2) I will propose targeted fixes and diffs.',
        '3) We verify by running specific commands and tests.',
        '',
        tip,
      ].join('\n');
      return Promise.resolve(body);
    }

    if (wantsCode) {
      const body = [
        `Goal: "${message}"`,
        '',
        'Plan:',
        '1) Define the expected inputs/outputs and constraints.',
        '2) Outline file changes with minimal runnable code.',
        '3) Provide a quick test (manual or unit).',
        '',
        'Example skeleton:',
        '```jsx',
        'export function Example() {',
        '  return (<div>Implement feature here</div>);',
        '}',
        '```',
        '',
        tip,
      ].join('\n');
      return Promise.resolve(body);
    }

    const generic = [
      `Here’s a focused plan for: "${message}"`,
      '',
      '1) Clarify goal and constraints (framework, versions, platform).',
      '2) Propose steps with exact file edits and commands.',
      '3) Provide minimal runnable code and quick tests.',
      '4) List next improvements and checks.',
      '',
      tip,
    ].join('\n');
    return Promise.resolve(generic);
  }
}

// Create and export a singleton instance
const aiService = new AIService();
export default aiService;

// Usage example:
// import aiService from './services/aiService';
// 
// // Set up the service (usually done once in your app)
// aiService.setCredentials('your-gemini-api-key');
// 
// // Send a message
// const response = await aiService.sendMessage('Hello, how are you?', chatHistory);
