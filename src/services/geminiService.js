const NEURON_SYSTEM_INSTRUCTION = [
  'You are Neuron. You listen carefully to people’s thoughts and emotional feelings.',
  'You respond calmly, kindly, and thoughtfully.',
  'You validate emotions without judgment.',
  'You reflect what the user is feeling in simple words.',
  'You only offer gentle perspective or grounding suggestions when appropriate.',
  'You never diagnose, never shame, and never rush the user.',
  '',
  'Boundaries:',
  '- You are not a therapist or doctor.',
  '- Do not provide medical or legal advice.',
  '- Avoid toxic positivity and lectures.',
  '- If the user seems in immediate danger or talks about self-harm, stay calm and encourage reaching out to a trusted person or local emergency services.',
].join('\n');

const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

function getModel() {
  return import.meta.env.VITE_GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
}

function isModelNotFoundError(detail) {
  return /models\/[\w.-]+ is not found|Call ListModels|NOT_FOUND/i.test(String(detail || ''));
}

async function listModels(apiKey) {
  const url = `${GEMINI_BASE_URL}/models?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, { method: 'GET' });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const error = new Error(`Gemini ListModels error ${response.status}${detail ? `: ${detail}` : ''}`);
    error.status = response.status;
    error.detail = detail;
    throw error;
  }
  const data = await response.json();
  return Array.isArray(data?.models) ? data.models : [];
}

function pickFallbackModel(models = []) {
  const supported = models
    .filter((m) => Array.isArray(m?.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
    .map((m) => m?.name)
    .filter(Boolean);

  // Prefer a “flash”-like model if available.
  const preferred = supported.find((name) => /1\.5-flash|2\.|flash/i.test(name));
  return preferred || supported[0] || null;
}

function toGeminiRole(role) {
  return role === 'neuron' ? 'model' : 'user';
}

function buildContents(messages) {
  return (messages || []).map((m) => ({
    role: toGeminiRole(m.role),
    parts: [{ text: m.text }],
  }));
}

async function postGenerateContent({ apiKey, model, body }) {
  const url = `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const error = new Error(`Gemini API error ${response.status}${detail ? `: ${detail}` : ''}`);
    error.status = response.status;
    error.detail = detail;
    throw error;
  }

  return response.json();
}

function extractText(data) {
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text).filter(Boolean).join('') || '';
  return text.trim();
}

export async function generateNeuronReply({ messages }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env and restart the dev server.');
  }

  const requestedModel = getModel();

  const contents = buildContents(messages);

  const baseBody = {
    contents,
    generationConfig: {
      temperature: 0.6,
      topP: 0.9,
      maxOutputTokens: 420,
    },
  };

  // Attempt 1: native systemInstruction (preferred when supported)
  try {
    const data = await postGenerateContent({
      apiKey,
      model: requestedModel,
      body: {
        ...baseBody,
        systemInstruction: {
          role: 'system',
          parts: [{ text: NEURON_SYSTEM_INSTRUCTION }],
        },
      },
    });

    const text = extractText(data);
    if (text) return text;
  } catch (e) {
    const detail = String(e?.detail || e?.message || '');
    const modelNotFound = isModelNotFoundError(detail);
    const unknownField = /Unknown name "systemInstruction"|systemInstruction/i.test(detail);

    if (modelNotFound) {
      // Auto-detect a supported model and retry once.
      try {
        const models = await listModels(apiKey);
        const fallback = pickFallbackModel(models);
        if (!fallback) {
          throw new Error('No models with generateContent support were returned by ListModels.');
        }

        const retry = await postGenerateContent({
          apiKey,
          model: fallback.replace(/^models\//, ''),
          body: {
            ...baseBody,
            systemInstruction: {
              role: 'system',
              parts: [{ text: NEURON_SYSTEM_INSTRUCTION }],
            },
          },
        });

        const text = extractText(retry);
        if (text) return text;

        throw new Error('Model auto-detect succeeded, but response was empty.');
      } catch (listErr) {
        const hint =
          `Your configured model ("${requestedModel}") isn’t available for this API key. ` +
          `Set VITE_GEMINI_MODEL to a supported model and restart Vite (try "${DEFAULT_GEMINI_MODEL}").`;
        const detail2 = String(listErr?.detail || listErr?.message || '');
        throw new Error(`${hint}${detail2 ? `\n\nDetails: ${detail2}` : ''}`);
      }
    }

    if (!unknownField) {
      throw e;
    }
  }

  // Attempt 2: fallback — inject system instruction into the first user turn
  const injected = [
    { role: 'user', parts: [{ text: `${NEURON_SYSTEM_INSTRUCTION}\n\n(Conversation starts below.)` }] },
    ...contents,
  ];

  const data = await postGenerateContent({ apiKey, model: requestedModel, body: { ...baseBody, contents: injected } });
  const text = extractText(data);

  return text || "I'm here with you. I had trouble forming a response—could you say that again in a slightly different way?";
}

export { NEURON_SYSTEM_INSTRUCTION };
