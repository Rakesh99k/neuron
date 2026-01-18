import { useEffect, useRef } from 'react';
import ThoughtBubble from './ThoughtBubble';

export default function ChatWindow({ messages, isThinking }) {
  const endRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' });
  }, [messages, isThinking]);

  return (
    <div className="nb-chat" role="log" aria-live="polite" aria-relevant="additions text" aria-atomic="false">
      {messages.map((m) => (
        <ThoughtBubble key={m.id} role={m.role} text={m.text} />
      ))}

      {isThinking ? (
        <div className="nb-row nb-row--neuron">
          <div className="nb-bubble nb-bubble--neuron nb-typing" role="status" aria-live="polite">
            Neuron is listening…
          </div>
        </div>
      ) : null}

      <div ref={endRef} />
    </div>
  );
}
