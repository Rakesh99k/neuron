# 🤖 Neuron - AI Chatbot (Gemini)

A modern, responsive AI chatbot built with React and Vite. This fork/config uses Google Gemini only for real AI responses and includes a demo mode when no key is set.

## ✨ Features

- 🎨 **Modern UI Design** - Clean, responsive chat interface
- 💬 **Real-time Chat** - Smooth message flow with typing indicators
- 🔌 **Gemini Integration** - Built-in Google Gemini support
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

## 🔧 Gemini Setup

The chatbot runs in demo mode without a key. To enable real Gemini responses:

1) Get a Gemini API key: https://aistudio.google.com/app/apikey
2) Add it to your `.env`:
```
VITE_GEMINI_API_KEY=your_real_key_here
VITE_DEFAULT_AI_PROVIDER=gemini
```
3) Restart the dev server: `npm run dev`

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

### Switching Models
Default model: gemini-2.5-flash.
Change the model in [src/services/aiService.js](src/services/aiService.js) or via the in-app ⚙️ settings.
Available options include `gemini-2.5-flash`, `gemini-1.5-flash`, and `gemini-1.5-pro`.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
