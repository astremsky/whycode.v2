import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code, action } = req.body;

    if (!code || !action) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const prompt =
      action === 'explain'
        ? `Explain the following code clearly:\n\n${code}`
        : `Suggest improvements and best practices for this code:\n\n${code}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const content =
      completion.choices[0]?.message?.content || 'No content returned';

    return res.status(200).json({ output: content });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
