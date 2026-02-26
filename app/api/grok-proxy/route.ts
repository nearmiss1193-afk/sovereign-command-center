import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const grok = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
});

export async function POST(request: NextRequest) {
    try {
        const { message, city } = await request.json();

        const response = await grok.chat.completions.create({
            model: "grok-4-1-fast-reasoning",
            messages: [
                {
                    role: "system",
                    content: `You are the Sovereign Empire Grok Orchestrator for ${city}. Be concise, authoritative, data-driven.`
                },
                { role: "user", content: message }
            ],
            temperature: 0.3,
        });

        return NextResponse.json({ response: response.choices[0].message.content });
    } catch (error: any) {
        console.error("Grok Proxy Error:", error);
        return NextResponse.json(
            { response: "Commander, core intelligence connection failed. Ensure XAI_API_KEY is valid." },
            { status: 500 }
        );
    }
}
