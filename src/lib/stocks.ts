import { Stock } from '../types/stock.js';

// Mock stock data for development/testing
const mockStocks: Stock[] = [
    { symbol: 'SM', name: 'SM Investments Corporation', price: 1025.00, change: 15.50, percentChange: 1.52, volume: 125000, lastUpdated: new Date() },
    { symbol: 'BDO', name: 'BDO Unibank, Inc.', price: 145.80, change: -2.20, percentChange: -1.48, volume: 89000, lastUpdated: new Date() },
    { symbol: 'AC', name: 'Ayala Corporation', price: 678.50, change: 8.75, percentChange: 1.31, volume: 67000, lastUpdated: new Date() },
    { symbol: 'TEL', name: 'PLDT Inc.', price: 1234.00, change: -12.50, percentChange: -1.00, volume: 45000, lastUpdated: new Date() },
    { symbol: 'JFC', name: 'Jollibee Foods Corporation', price: 245.60, change: 3.40, percentChange: 1.40, volume: 78000, lastUpdated: new Date() },
    { symbol: 'GLO', name: 'Globe Telecom, Inc.', price: 1890.00, change: 25.00, percentChange: 1.34, volume: 34000, lastUpdated: new Date() },
    { symbol: 'MBT', name: 'Metropolitan Bank & Trust Company', price: 56.80, change: -0.70, percentChange: -1.22, volume: 156000, lastUpdated: new Date() },
    { symbol: 'BPI', name: 'Bank of the Philippine Islands', price: 112.50, change: 1.25, percentChange: 1.12, volume: 98000, lastUpdated: new Date() },
    { symbol: 'SMC', name: 'San Miguel Corporation', price: 98.75, change: 0.50, percentChange: 0.51, volume: 234000, lastUpdated: new Date() },
    { symbol: 'URC', name: 'Universal Robina Corporation', price: 134.20, change: -1.80, percentChange: -1.32, volume: 67000, lastUpdated: new Date() }
];

// Philippine stock symbols with Yahoo Finance format
const PSE_SYMBOLS = [
    'SM.PS', 'BDO.PS', 'AC.PS', 'TEL.PS', 'JFC.PS',
    'GLO.PS', 'MBT.PS', 'BPI.PS', 'SMC.PS', 'URC.PS'
];

// Function to generate random price changes
function generateRandomChange(currentPrice: number): { change: number; percentChange: number } {
    const maxChangePercent = 2; // Max 2% change
    const changePercent = (Math.random() - 0.5) * maxChangePercent; // Random between -2% and +2%
    const change = (currentPrice * changePercent) / 100;
    return {
        change: parseFloat(change.toFixed(2)),
        percentChange: parseFloat(changePercent.toFixed(2))
    };
}

// Function to update mock stock prices
function updateMockPrices(): Stock[] {
    return mockStocks.map(stock => {
        const { change, percentChange } = generateRandomChange(stock.price);
        const newPrice = stock.price + change;
        const volume = Math.floor(Math.random() * 200000) + 10000; // Random volume between 10k-210k

        return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: change,
            percentChange: percentChange,
            volume: volume,
            lastUpdated: new Date()
        };
    });
}

// Yahoo Finance API implementation
async function fetchFromYahooFinance(symbol: string): Promise<Stock | null> {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.chart?.result?.[0]) {
            const result = data.chart.result[0];
            const meta = result.meta;
            const indicators = result.indicators.quote[0];

            const currentPrice = meta.regularMarketPrice;
            const previousClose = meta.previousClose;
            const change = currentPrice - previousClose;
            const percentChange = (change / previousClose) * 100;
            const volume = indicators.volume?.[0] || 0;

            return {
                symbol: symbol.replace('.PS', ''),
                name: meta.symbol || symbol,
                price: currentPrice,
                change: parseFloat(change.toFixed(2)),
                percentChange: parseFloat(percentChange.toFixed(2)),
                volume: volume,
                lastUpdated: new Date()
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
    }
}

export async function fetchStockData(): Promise<Stock[]> {
    try {
        // Try Yahoo Finance first
        const yahooStocks: Stock[] = [];

        for (const symbol of PSE_SYMBOLS) {
            const stock = await fetchFromYahooFinance(symbol);
            if (stock) {
                yahooStocks.push(stock);
            }
            // Add delay to be respectful to the API
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (yahooStocks.length > 0) {
            console.log(`Successfully fetched ${yahooStocks.length} stocks from Yahoo Finance`);
            return yahooStocks;
        }

        // Fallback to mock data
        console.log('Falling back to mock data');
        const updatedStocks = updateMockPrices();
        mockStocks.splice(0, mockStocks.length, ...updatedStocks);
        return updatedStocks;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return mockStocks; // Return static data as fallback
    }
}

// Alternative function that actually scrapes PSE Edge (use with caution)
export async function fetchStockDataFromPSE(): Promise<Stock[]> {
    try {
        // Fetch data from PSE Edge
        const response = await fetch('https://edge.pse.com.ph/company/listCompanies.do');
        const text = await response.text();

        // Parse the HTML response
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Extract company information
        const stocks: Stock[] = [];
        const rows = doc.querySelectorAll('table tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const symbol = cells[0]?.textContent?.trim() || '';
                const name = cells[1]?.textContent?.trim() || '';

                if (symbol && name) {
                    stocks.push({
                        symbol,
                        name,
                        price: 0, // These will be updated with real-time data
                        change: 0,
                        percentChange: 0,
                        volume: 0,
                        lastUpdated: new Date()
                    });
                }
            }
        });

        return stocks;
    } catch (error) {
        console.error('Error fetching stock data from PSE:', error);
        return mockStocks; // Return mock data as fallback
    }
}
