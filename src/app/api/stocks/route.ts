import { NextResponse } from 'next/server';
import { fetchStockData } from '@/lib/stocks';

export async function GET() {
    try {
        const stocks = await fetchStockData();
        return NextResponse.json({ stocks });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
    }
}
