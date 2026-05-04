import type { Message } from '@aria/shared';
import { Errors } from '../lib/errors.js';

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function streamDeepseek(
  messages: Message[],
  maxTokens: number,
  temperature: number,
  onChunk: (chunk: string) => void,
): Promise<{ inputTokens: number; outputTokens: number }> {
  const apiKey = process.env['DEEPSEEK_API_KEY'];
  if (!apiKey) throw Errors.upstreamDeepseek('DeepSeek API key not configured');

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      max_tokens: maxTokens,
      temperature,
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw Errors.upstreamDeepseek(err);
  }

  if (!res.body) throw Errors.upstreamDeepseek('No response body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let inputTokens = 0;
  let outputTokens = 0;
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data) as {
          choices: Array<{ delta?: { content?: string } }>;
          usage?: { prompt_tokens: number; completion_tokens: number };
        };

        if (parsed.usage) {
          inputTokens = parsed.usage.prompt_tokens;
          outputTokens = parsed.usage.completion_tokens;
        }

        const content = parsed.choices[0]?.delta?.content;
        if (content) onChunk(content);
      } catch {
        // skip malformed chunks
      }
    }
  }

  return { inputTokens, outputTokens };
}

export async function callDeepseek(
  messages: Message[],
  maxTokens: number,
  temperature: number,
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const apiKey = process.env['DEEPSEEK_API_KEY'];
  if (!apiKey) throw Errors.upstreamDeepseek('DeepSeek API key not configured');

  const res = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: 'deepseek-chat', messages, max_tokens: maxTokens, temperature, stream: false }),
  });

  if (!res.ok) throw Errors.upstreamDeepseek(await res.text());

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
    usage: { prompt_tokens: number; completion_tokens: number };
  };

  return {
    content: data.choices[0]?.message.content ?? '',
    inputTokens: data.usage.prompt_tokens,
    outputTokens: data.usage.completion_tokens,
  };
}
