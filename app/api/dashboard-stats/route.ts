import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const city = request.nextUrl.searchParams.get('city') || 'all_cities';

    // Fake realistic data patterns
    const data: any = {
        lakeland: {
            touches: 84,
            enrichment: 92,
            active_daemons: 2,
            revenue_forecast: "$7,200",
            health: "Normal"
        },
        orlando: {
            touches: 58,
            enrichment: 79,
            active_daemons: 2,
            revenue_forecast: "$11,250",
            health: "Normal"
        },
        all_cities: {
            touches: 142,
            enrichment: 87,
            active_daemons: 4,
            revenue_forecast: "$18,450",
            health: "Normal"
        }
    };

    const stats = data[city] || data.all_cities;

    return NextResponse.json(stats);
}
