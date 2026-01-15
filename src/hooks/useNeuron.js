import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generateNeuronReply } from '../services/geminiService';

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

export function useNeuron() {
  const [messages, setMessages] = useState(() => [
    {
      id: uid(),
      role: 'neuron',
      text: "Hi. I'm Neuron. I'm here to listen—no judgment, no rushing. What's on your mind right now?",
      createdAt: Date.now(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Prevent double-sends if a user clicks quickly.
  const inFlightRef = useRef(false);

  const canSend = useMemo(() => !isThinking && !inFlightRef.current, [isThinking]);

  const sendThought = useCallback(async (rawText) => {
    const text = normalizeText(rawText);
    if (!text) return;
    if (inFlightRef.current) return;

    setError(null);
    inFlightRef.current = true;

    const userMsg = { id: uid(), role: 'user', text, createdAt: Date.now() };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const next = [...messagesRef.current, userMsg];
      const reply = await generateNeuronReply({
        messages: next.map((m) => ({ role: m.role, text: m.text })),
      });

      const neuronMsg = {
        id: uid(),
        role: 'neuron',
        text: reply,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, neuronMsg]);
    } catch (e) {
      const friendly =
        "I'm here. Something went wrong while I was trying to respond. If you want, you can try again—or just tell me what you're feeling in one sentence.";
      setError(e?.message || 'Failed to reach Gemini');
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'neuron', text: friendly, createdAt: Date.now() },
      ]);
    } finally {
      setIsThinking(false);
      inFlightRef.current = false;
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsThinking(false);
    inFlightRef.current = false;
    setMessages([
      {
        id: uid(),
        role: 'neuron',
        text: "We can start fresh. What's present for you right now?",
        createdAt: Date.now(),
      },
    ]);
  }, []);

  return { messages, isThinking, error, canSend, sendThought, reset };
}
