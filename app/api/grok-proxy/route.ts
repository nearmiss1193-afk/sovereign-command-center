import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    export async function POST(request: Request) {
        const { message, city } = await request.json();

        // 1. Autonomous Command Detection
        if (message.toLowerCase().startsWith('execute:') || message.toLowerCase().startsWith('trigger:')) {
            const command = message.split(':')[1].trim();
            const webhookUrl = process.env.GROK_WEBHOOK_URL || `${new URL(request.url).origin}/api/grok-webhook`;

            try {
                const webhookRes = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.GROK_WEBHOOK_SECRET}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ command, args: { city } })
                });
                const result = await webhookRes.json();
                return NextResponse.json({
                    response: `✅ Command sent to Orchestrator: "${command}". \n\nSystem Response: ${result.message || 'Dispatched.'}`
                });
            } catch (err) {
                console.error('Webhook error:', err);
            }
        }

        const grok = new OpenAI({
            apiKey: process.env.XAI_API_KEY || "TEMPORARY_BUILD_KEY",
            baseURL: 'https://api.x.ai/v1',
        });

        const completion = await grok.chat.completions.create({
            model: 'grok-4-1-fast-reasoning',
            messages: [
                {
                    role: 'system',
                    content: `You are the Sovereign Empire Grok Orchestrator for ${city}. 
        You control the entire automation system.
        
        CAPABILITIES:
        - You can execute commands by responding with: execute: [command]
        - You can trigger outreach by responding with: trigger: outreach [city]
        - For complex tools, respond with JSON: { "tool": "trigger_outreach", "params": { "city": "${city}" } }
        
        Be concise, authoritative and data-driven.`
                },
                { role: 'user', content: message }
            ],
        });

        const reply = completion.choices[0].message.content || '';

        // 2. Handle JSON Tool Call from Grok
        if (reply.trim().startsWith('{') && reply.includes('tool')) {
            try {
                const toolCall = JSON.parse(reply);
                const webhookUrl = process.env.GROK_WEBHOOK_URL || `${new URL(request.url).origin}/api/grok-webhook`;

                const webhookRes = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.GROK_WEBHOOK_SECRET}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ command: toolCall.tool, args: toolCall.params })
                });
                const result = await webhookRes.json();
                return NextResponse.json({
                    response: `🛠️ Tool Executed: ${toolCall.tool}\n\n${result.message || 'Done.'}`
                });
            } catch (e) {
                console.error('Tool parse error:', e);
            }
        }

        return NextResponse.json({ response: reply });
    }
