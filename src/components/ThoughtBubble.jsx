export default function ThoughtBubble({ role, text }) {
  const isUser = role === 'user';

  return (
    <div className={`nb-row ${isUser ? 'nb-row--user' : 'nb-row--neuron'}`} data-role={role}>
      <div className={`nb-bubble ${isUser ? 'nb-bubble--user' : 'nb-bubble--neuron'}`} data-role={role}>
        {text}
      </div>
    </div>
  );
}
