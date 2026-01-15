import ChatWindow from './components/ChatWindow'
import ThoughtInput from './components/ThoughtInput'
import { useNeuron } from './hooks/useNeuron'

function App() {
  const { messages, isThinking, error, sendThought, reset } = useNeuron()

  return (
    <div className="nb-app">
      <div className="nb-shell">
        <header className="nb-header">
          <div>
            <div className="nb-title">Neuron</div>
            <div className="nb-subtitle">A calm space for thoughts.</div>
          </div>
          <button className="nb-reset" type="button" onClick={reset} disabled={isThinking}>
            New
          </button>
        </header>

        <ChatWindow messages={messages} isThinking={isThinking} />

        {error ? (
          <div className="nb-error" role="status">
            {error}
          </div>
        ) : null}

        <ThoughtInput disabled={isThinking} onSend={sendThought} />
      </div>
    </div>
  )
}

export default App
