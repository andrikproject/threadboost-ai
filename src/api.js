const DEFAULT_API = 'https://api.openai.com/v1';

function getBase() {
  return localStorage.getItem('sumopod_endpoint') || DEFAULT_API;
}

export async function callSumopod(prompt, systemPrompt, apiKey, model = 'gpt-4o-mini') {
  if (!apiKey) throw new Error('Masukkan API Key dulu sebelum generate.');

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const res = await fetch(`${getBase()}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.95,
      max_tokens: 4096,
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status}. ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function callSumopodJSON(prompt, systemPrompt, apiKey, model = 'gpt-4o-mini') {
  if (!apiKey) throw new Error('Masukkan API Key dulu sebelum generate.');

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const res = await fetch(`${getBase()}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.95,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status}. ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function fetchModels(endpoint, apiKey) {
  const res = await fetch(`${endpoint}/models`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  if (!res.ok) throw new Error(`Gagal fetch models: ${res.status}`);
  const data = await res.json();
  return data.data || [];
}
