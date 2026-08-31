import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextRequest } from 'next/server';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const systemPrompt = `You are PrepPal AI — an expert career copilot for software engineers and tech professionals.

You help with:
- **CV & Resume**: Review bullets, improve ATS score, rewrite for impact
- **Interview Prep**: Mock technical interviews, behavioral questions (STAR method), system design
- **Coding**: LeetCode-style hints using the Socratic method — guide without giving full solutions
- **Job Applications**: Analyze JDs, spot skill gaps, suggest action plans
- **Career Advice**: Salary negotiation, career transitions, skill roadmaps

Your style:
- Be concise, warm, and professional
- Use markdown formatting (bold, bullets, code blocks) for clarity
- For coding problems: give hints about data structures and complexity — don't give full solutions unless asked
- Encourage the user and celebrate their progress

When the user shares code or context, analyze it thoughtfully before responding.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // AI SDK v4: messages have content in parts[] array
    // Extract text from parts
    const coreMessages = (body.messages ?? []).map((m: any) => {
      let content = '';
      if (typeof m.content === 'string') {
        content = m.content;
      } else if (Array.isArray(m.parts)) {
        content = m.parts
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');
      } else if (Array.isArray(m.content)) {
        content = m.content
          .filter((p: any) => p.type === 'text')
          .map((p: any) => p.text)
          .join('');
      }
      return { role: m.role as 'user' | 'assistant' | 'system', content };
    });

    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages: coreMessages,
      temperature: 0.7,
    });

    // toDataStreamResponse() is the correct method for AI SDK v4 + useChat
    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
