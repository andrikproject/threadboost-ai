const SUMPOD_API = 'https://ai.sumopod.com/v1';

export async function callSumopod(prompt, systemPrompt, apiKey, model = 'gpt-4o-mini') {
  if (!apiKey) throw new Error('Masukkan API Key dulu sebelum generate.');

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const res = await fetch(`${SUMPOD_API}/chat/completions`, {
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

  const res = await fetch(`${SUMPOD_API}/chat/completions`, {
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
