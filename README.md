# 🤖 Neuron - AI Chatbot

A modern, responsive AI chatbot built with React and Vite. This project provides a beautiful chat interface with support for multiple AI providers.

## ✨ Features

- 🎨 **Modern UI Design** - Clean, responsive chat interface
- 💬 **Real-time Chat** - Smooth message flow with typing indicators
- 🔌 **AI Integration Ready** - Pre-built structure for OpenAI, Claude, and Gemini APIs
- 📱 **Mobile Responsive** - Works perfectly on all device sizes
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development
- 🎭 **Message Animation** - Smooth animations for incoming messages

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rakesh99k/neuron.git
cd neuron
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 AI Integration

The chatbot is currently running with simulated AI responses. To integrate with real AI services:

### OpenAI Integration
```javascript
import aiService from './services/aiService';

// Configure OpenAI
aiService.setCredentials('your-openai-api-key', 'openai');
```

### Claude Integration
```javascript
import aiService from './services/aiService';

// Configure Claude
aiService.setCredentials('your-anthropic-api-key', 'claude');
```

### Google Gemini Integration
```javascript
import aiService from './services/aiService';

// Configure Gemini
aiService.setCredentials('your-gemini-api-key', 'gemini');
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Chatbot.jsx          # Main chatbot container
│   ├── ChatMessage.jsx      # Individual message component
│   ├── ChatInput.jsx        # Message input component
│   └── *.css                # Component styles
├── services/
│   └── aiService.js         # AI API integration service
├── App.jsx                  # Main app component
└── main.jsx                 # App entry point
```

## 🎨 Customization

### Changing the Theme
Modify the CSS custom properties in the component stylesheets to match your brand colors.

### Adding New AI Providers
Extend the `aiService.js` file to add support for additional AI APIs.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
