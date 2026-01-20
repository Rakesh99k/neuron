import { useEffect, useRef, useState } from 'react';

export default function ThoughtInput({ disabled, onSend }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  function submit() {
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    setValue('');
    onSend?.(trimmed);
  }

  return (
    <form
      className="nb-input"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <textarea
        ref={textareaRef}
        className="nb-textarea"
        placeholder={disabled ? 'Neuron is listening…' : 'Say what’s true for you…'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={2}
        disabled={disabled}
        maxLength={4000}
        aria-label="Your message"
      />
      <button
        className="nb-send"
        onClick={() => submit()}
        disabled={disabled || !value.trim()}
        type="submit"
      >
        Send
      </button>
    </form>
  );
}
