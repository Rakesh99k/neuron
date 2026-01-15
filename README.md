# Neuron

Neuron is a calm, non-judgmental chatbot designed to listen to thoughts and emotions and respond with gentle reflection.

Neuron is not a therapist, not a doctor, and not a crisis service.

## Features

- Soft, distraction-free chat UI
- Conversation memory (full chat history is sent each request)
- Typing indicator: “Neuron is listening…”
- Input is disabled while Neuron responds
- Gentle error messages when the API fails

## Local Setup

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

3. Configure your Gemini key:

- Copy [\.env.example](.env.example) to `.env`
- Set:
	- `VITE_GEMINI_API_KEY=your_key_here`

4. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Gemini Model

- Uses `gemini-1.5-flash` by default via the Google Generative Language API.
- Override with `VITE_GEMINI_MODEL` in your `.env` if your account/region supports different models.
- The Neuron personality instruction is included on every request (see [src/services/geminiService.js](src/services/geminiService.js)).

## Project Structure

```
src/
├── components/
│   ├── ChatWindow.jsx
│   ├── ThoughtBubble.jsx
│   └── ThoughtInput.jsx
├── services/
│   └── geminiService.js
├── hooks/
│   └── useNeuron.js
├── App.jsx                  # Main app component
└── main.jsx                 # App entry point
```

## Emotional Design Choices

- Low visual pressure: soft background, no flashing/celebratory effects.
- Short-to-medium replies: tuned output length to avoid overwhelm.
- “Listening” over “fixing”: the prompt prioritizes validation and reflection before suggestions.
- Optional questions: Neuron asks gentle questions without interrogating.

## Common Mistakes To Avoid (Mental-health-adjacent AI)

- Diagnosing (“you have X”) or implying certainty about mental conditions.
- Medical advice, treatment plans, or crisis instructions.
- Toxic positivity (“just be positive”, “everything happens for a reason”).
- Over-long replies that feel like a lecture.
- Pushing solutions too early instead of reflecting what the user said.

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


