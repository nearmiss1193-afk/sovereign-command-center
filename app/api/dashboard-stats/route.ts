import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        touches: 142,
        enrichment: 87,
        daemons: 4,
        revenue: "$18,450",
        health: "Normal"
    });
}
