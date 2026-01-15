import { useEffect, useRef } from 'react';
import ThoughtBubble from './ThoughtBubble';

export default function ChatWindow({ messages, isThinking }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isThinking]);

  return (
    <div className="nb-chat" role="log" aria-live="polite">
      {messages.map((m) => (
        <ThoughtBubble key={m.id} role={m.role} text={m.text} />
      ))}

      {isThinking ? (
        <div className="nb-row nb-row--neuron">
          <div className="nb-bubble nb-bubble--neuron nb-typing">Neuron is listening…</div>
        </div>
      ) : null}

      <div ref={endRef} />
    </div>
  );
}
