import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const grok = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
});

export async function POST(request: Request) {
    const { message, city } = await request.json();

    const completion = await grok.chat.completions.create({
        model: 'grok-4-1-fast-reasoning',
        messages: [
            { role: 'system', content: `You are the Sovereign Empire Grok Orchestrator for ${city}. Be concise, authoritative and data-driven.` },
            { role: 'user', content: message }
        ],
    });

    return NextResponse.json({ response: completion.choices[0].message.content });
}
