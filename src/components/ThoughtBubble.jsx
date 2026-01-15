export default function ThoughtBubble({ role, text }) {
  const isUser = role === 'user';

  return (
    <div className={`nb-row ${isUser ? 'nb-row--user' : 'nb-row--neuron'}`}>
      <div className={`nb-bubble ${isUser ? 'nb-bubble--user' : 'nb-bubble--neuron'}`}>
        {text}
      </div>
    </div>
  );
}
