import { NextResponse } from 'next/server';
import { fetchStockData } from '@/lib/stocks';

export async function GET() {
    try {
        console.log('API: Fetching real-time stock data...');
        const stocks = await fetchStockData();

        console.log(`API: Successfully fetched ${stocks.length} stocks`);
        return NextResponse.json({
            stocks: stocks,
            timestamp: new Date().toISOString(),
            source: 'yahoo-finance'
        });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({
            error: 'Failed to fetch stock data',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
