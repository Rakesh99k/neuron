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
    const v = value;
    setValue('');
    onSend?.(v);
  }

  return (
    <div className="nb-input">
      <textarea
        ref={textareaRef}
        className="nb-textarea"
        placeholder={disabled ? 'Neuron is listening…' : 'Say what’s true for you…'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled) submit();
          }
        }}
        rows={2}
        disabled={disabled}
        aria-label="Your message"
      />
      <button
        className="nb-send"
        onClick={() => submit()}
        disabled={disabled || !value.trim()}
        type="button"
      >
        Send
      </button>
    </div>
  );
}
