import { Stock } from '../types/stock.js';
import { fetchStocksAll } from 'pse-edge/lib';

// All 30 PSEi stocks with their correct Yahoo Finance symbols
// Note: Many PSEi stocks don't use .PS suffix on Yahoo Finance
// const PSEI_SYMBOLS = [
//     'AC.PS', 'ALI.PS', 'AP.PS', 'AREIT.PS', 'BDO.PS', 'BLOOM.PS', 'BPI.PS', 'CNVRG.PS', 'DMC.PS', 'EMP.PS',
//     'GLO.PS', 'GTCAP.PS', 'ICT.PS', 'JFC.PS', 'LTG.PS', 'MBT.PS', 'MEG.PS', 'MER.PS', 'MPI.PS', 'PGOLD.PS',
//     'RRHI.PS', 'SECB.PS', 'SM.PS', 'SMC.PS', 'SMPH.PS', 'TEL.PS', 'URC.PS', 'WLCON.PS', 'MONDE.PS', 'ACEN.PS'
// ];

// Alternative symbols that might work better on Yahoo Finance
const ALTERNATIVE_SYMBOLS = [
    'AC', 'ALI', 'AP', 'AREIT', 'BDO', 'BLOOM', 'BPI', 'CNVRG', 'DMC', 'EMP',
    'GLO', 'GTCAP', 'ICT', 'JFC', 'LTG', 'MBT', 'MEG', 'MER', 'MPI', 'PGOLD',
    'RRHI', 'SECB', 'SM', 'SMC', 'SMPH', 'TEL', 'URC', 'WLCON', 'MONDE', 'ACEN'
];

// Stock names mapping
const STOCK_NAMES: { [symbol: string]: string } = {
    'AC': 'Ayala Corporation',
    'ALI': 'Ayala Land, Inc.',
    'AP': 'Aboitiz Power Corporation',
    'AREIT': 'AREIT, Inc.',
    'BDO': 'BDO Unibank, Inc.',
    'BLOOM': 'Bloomberry Resorts Corporation',
    'BPI': 'Bank of the Philippine Islands',
    'CNVRG': 'Converge ICT Solutions, Inc.',
    'DMC': 'DMCI Holdings, Inc.',
    'EMP': 'Emperador Inc.',
    'GLO': 'Globe Telecom, Inc.',
    'GTCAP': 'GT Capital Holdings, Inc.',
    'ICT': 'International Container Terminal Services, Inc.',
    'JFC': 'Jollibee Foods Corporation',
    'LTG': 'LT Group, Inc.',
    'MBT': 'Metropolitan Bank & Trust Company',
    'MEG': 'Megaworld Corporation',
    'MER': 'Manila Electric Company',
    'MPI': 'Metro Pacific Investments Corporation',
    'PGOLD': 'Puregold Price Club, Inc.',
    'RRHI': 'Robinsons Retail Holdings, Inc.',
    'SECB': 'Security Bank Corporation',
    'SM': 'SM Investments Corporation',
    'SMC': 'San Miguel Corporation',
    'SMPH': 'SM Prime Holdings, Inc.',
    'TEL': 'PLDT Inc.',
    'URC': 'Universal Robina Corporation',
    'WLCON': 'Wilcon Depot, Inc.',
    'MONDE': 'Monde Nissin Corporation',
    'ACEN': 'ACEN Corporation',
};

// Mock stock data as fallback
const mockStocks: Stock[] = [
    { symbol: 'AC', name: 'Ayala Corporation', price: 800, change: 0, percentChange: 0, volume: 100000, lastUpdated: new Date() },
    { symbol: 'ALI', name: 'Ayala Land, Inc.', price: 30, change: 0, percentChange: 0, volume: 120000, lastUpdated: new Date() },
    { symbol: 'AP', name: 'Aboitiz Power Corporation', price: 35, change: 0, percentChange: 0, volume: 90000, lastUpdated: new Date() },
    { symbol: 'AREIT', name: 'AREIT, Inc.', price: 35, change: 0, percentChange: 0, volume: 80000, lastUpdated: new Date() },
    { symbol: 'BDO', name: 'BDO Unibank, Inc.', price: 145, change: 0, percentChange: 0, volume: 110000, lastUpdated: new Date() },
    { symbol: 'BLOOM', name: 'Bloomberry Resorts Corporation', price: 10, change: 0, percentChange: 0, volume: 95000, lastUpdated: new Date() },
    { symbol: 'BPI', name: 'Bank of the Philippine Islands', price: 112, change: 0, percentChange: 0, volume: 98000, lastUpdated: new Date() },
    { symbol: 'CNVRG', name: 'Converge ICT Solutions, Inc.', price: 15, change: 0, percentChange: 0, volume: 70000, lastUpdated: new Date() },
    { symbol: 'DMC', name: 'DMCI Holdings, Inc.', price: 9, change: 0, percentChange: 0, volume: 60000, lastUpdated: new Date() },
    { symbol: 'EMP', name: 'Emperador Inc.', price: 20, change: 0, percentChange: 0, volume: 65000, lastUpdated: new Date() },
    { symbol: 'GLO', name: 'Globe Telecom, Inc.', price: 1890, change: 0, percentChange: 0, volume: 34000, lastUpdated: new Date() },
    { symbol: 'GTCAP', name: 'GT Capital Holdings, Inc.', price: 500, change: 0, percentChange: 0, volume: 30000, lastUpdated: new Date() },
    { symbol: 'ICT', name: 'International Container Terminal Services, Inc.', price: 200, change: 0, percentChange: 0, volume: 40000, lastUpdated: new Date() },
    { symbol: 'JFC', name: 'Jollibee Foods Corporation', price: 245, change: 0, percentChange: 0, volume: 78000, lastUpdated: new Date() },
    { symbol: 'LTG', name: 'LT Group, Inc.', price: 10, change: 0, percentChange: 0, volume: 50000, lastUpdated: new Date() },
    { symbol: 'MBT', name: 'Metropolitan Bank & Trust Company', price: 56, change: 0, percentChange: 0, volume: 156000, lastUpdated: new Date() },
    { symbol: 'MEG', name: 'Megaworld Corporation', price: 2, change: 0, percentChange: 0, volume: 80000, lastUpdated: new Date() },
    { symbol: 'MER', name: 'Manila Electric Company', price: 350, change: 0, percentChange: 0, volume: 25000, lastUpdated: new Date() },
    { symbol: 'MPI', name: 'Metro Pacific Investments Corporation', price: 5, change: 0, percentChange: 0, volume: 60000, lastUpdated: new Date() },
    { symbol: 'PGOLD', name: 'Puregold Price Club, Inc.', price: 30, change: 0, percentChange: 0, volume: 40000, lastUpdated: new Date() },
    { symbol: 'RRHI', name: 'Robinsons Retail Holdings, Inc.', price: 50, change: 0, percentChange: 0, volume: 35000, lastUpdated: new Date() },
    { symbol: 'SECB', name: 'Security Bank Corporation', price: 80, change: 0, percentChange: 0, volume: 30000, lastUpdated: new Date() },
    { symbol: 'SM', name: 'SM Investments Corporation', price: 1025, change: 0, percentChange: 0, volume: 125000, lastUpdated: new Date() },
    { symbol: 'SMC', name: 'San Miguel Corporation', price: 98, change: 0, percentChange: 0, volume: 234000, lastUpdated: new Date() },
    { symbol: 'SMPH', name: 'SM Prime Holdings, Inc.', price: 35, change: 0, percentChange: 0, volume: 90000, lastUpdated: new Date() },
    { symbol: 'TEL', name: 'PLDT Inc.', price: 1234, change: 0, percentChange: 0, volume: 45000, lastUpdated: new Date() },
    { symbol: 'URC', name: 'Universal Robina Corporation', price: 134, change: 0, percentChange: 0, volume: 67000, lastUpdated: new Date() },
    { symbol: 'WLCON', name: 'Wilcon Depot, Inc.', price: 25, change: 0, percentChange: 0, volume: 30000, lastUpdated: new Date() },
    { symbol: 'MONDE', name: 'Monde Nissin Corporation', price: 10, change: 0, percentChange: 0, volume: 40000, lastUpdated: new Date() },
    { symbol: 'ACEN', name: 'ACEN Corporation', price: 6, change: 0, percentChange: 0, volume: 50000, lastUpdated: new Date() },
];

// Function to generate random price changes for mock data
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
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

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

            const baseSymbol = symbol.replace('.PS', '');

            return {
                symbol: baseSymbol,
                name: STOCK_NAMES[baseSymbol] || baseSymbol,
                price: currentPrice,
                change: parseFloat(change.toFixed(2)),
                percentChange: parseFloat(percentChange.toFixed(2)),
                volume: volume,
                lastUpdated: new Date()
            };
        }
        return null;
    } catch (error: unknown) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
    }
}

// Enhanced Yahoo Finance API implementation that tries multiple symbol formats
async function fetchStockFromYahooFinance(baseSymbol: string): Promise<Stock | null> {
    // Try different symbol formats
    const symbolFormats = [
        `${baseSymbol}.PS`,  // Try with .PS suffix first
        baseSymbol,          // Try without suffix
        `${baseSymbol}.PM`,  // Try with .PM suffix (some PH stocks use this, rare)
    ];

    for (const symbol of symbolFormats) {
        try {
            const stock = await fetchFromYahooFinance(symbol);
            if (stock) {
                console.log(`✅ Successfully fetched ${baseSymbol} using symbol: ${symbol}`);
                return stock;
            }
        } catch (error: unknown) {
            // If error is 404, try next variant, else log
            if (
                typeof error === 'object' &&
                error !== null &&
                'message' in error &&
                typeof (error as Record<string, unknown>).message === 'string' &&
                (error as { message: string }).message.includes('404')
            ) {
                continue;
            } else {
                console.error(`Error fetching ${symbol}:`, error);
            }
        }
    }

    console.log(`❌ Could not fetch ${baseSymbol} with any symbol format (.PS, no suffix, .PM)`);
    return null;
}

// Batch fetch from Yahoo Finance with rate limiting
async function fetchAllFromYahooFinance(): Promise<Stock[]> {
    const stocks: Stock[] = [];
    const batchSize = 5; // Process 5 stocks at a time to avoid rate limiting

    // Use base symbols instead of .PS symbols
    for (let i = 0; i < ALTERNATIVE_SYMBOLS.length; i += batchSize) {
        const batch = ALTERNATIVE_SYMBOLS.slice(i, i + batchSize);

        const batchPromises = batch.map(async (baseSymbol) => {
            const stock = await fetchStockFromYahooFinance(baseSymbol);
            return stock;
        });

        const batchResults = await Promise.all(batchPromises);
        const validStocks = batchResults.filter(stock => stock !== null) as Stock[];
        stocks.push(...validStocks);

        // Add delay between batches to be respectful to the API
        if (i + batchSize < ALTERNATIVE_SYMBOLS.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return stocks;
}

// Alternative: Fetch from Alpha Vantage (requires API key)
// async function fetchFromAlphaVantage(symbol: string, apiKey: string): Promise<Stock | null> {
//     try {
//         const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.PS&apikey=${apiKey}`;
//         const response = await fetch(url);
//         const data = await response.json();
//
//         if (data['Global Quote']) {
//             const quote = data['Global Quote'];
//             const currentPrice = parseFloat(quote['05. price']);
//             const previousClose = parseFloat(quote['08. previous close']);
//             const change = currentPrice - previousClose;
//             const percentChange = parseFloat(quote['10. change percent'].replace('%', ''));
//             const volume = parseInt(quote['06. volume']);
//
//             const baseSymbol = symbol.replace('.PS', '');
//
//             return {
//                 symbol: baseSymbol,
//                 name: STOCK_NAMES[baseSymbol] || baseSymbol,
//                 price: currentPrice,
//                 change: parseFloat(change.toFixed(2)),
//                 percentChange: parseFloat(percentChange.toFixed(2)),
//                 volume: volume,
//                 lastUpdated: new Date()
//             };
//         }
//         return null;
//     } catch (error) {
//         console.error(`Error fetching ${symbol} from Alpha Vantage:`, error);
//         return null;
//     }
// }

// Main function to fetch stock data with multiple fallbacks
export async function fetchStockData(): Promise<Stock[]> {
    try {
        console.log('Fetching real-time stock data from Yahoo Finance...');

        // Try Yahoo Finance first
        const yahooStocks = await fetchAllFromYahooFinance();

        if (yahooStocks.length > 0) {
            console.log(`Successfully fetched ${yahooStocks.length} stocks from Yahoo Finance`);

            // Fill in any missing stocks with mock data
            const fetchedSymbols = new Set(yahooStocks.map(s => s.symbol));
            const missingStocks = mockStocks.filter(stock => !fetchedSymbols.has(stock.symbol));

            if (missingStocks.length > 0) {
                console.log(`Using mock data for ${missingStocks.length} stocks not available on Yahoo Finance`);
                const updatedMissingStocks = updateMockPrices().filter(stock => !fetchedSymbols.has(stock.symbol));
                yahooStocks.push(...updatedMissingStocks);
            }

            return yahooStocks.sort((a, b) => a.symbol.localeCompare(b.symbol));
        }

        // Fallback to mock data
        console.log('Yahoo Finance failed, falling back to mock data');
        const updatedStocks = updateMockPrices();
        return updatedStocks;

    } catch (error) {
        console.error('Error fetching stock data:', error);
        console.log('Using mock data as fallback');
        return updateMockPrices();
    }
}

// Function to get real-time data for a specific stock
export async function fetchSingleStockData(symbol: string): Promise<Stock | null> {
    try {
        // Try to fetch real-time data first
        const stock = await fetchStockFromYahooFinance(symbol);

        if (stock) {
            return stock;
        }

        // Fallback to mock data
        const mockStock = mockStocks.find(s => s.symbol === symbol);
        if (mockStock) {
            const { change, percentChange } = generateRandomChange(mockStock.price);
            return {
                ...mockStock,
                price: mockStock.price + change,
                change: change,
                percentChange: percentChange,
                volume: Math.floor(Math.random() * 200000) + 10000,
                lastUpdated: new Date()
            };
        }

        return null;
    } catch (error) {
        console.error(`Error fetching single stock data for ${symbol}:`, error);
        return null;
    }
}

// Legacy functions for compatibility
export async function fetchAllPSEStocks(): Promise<unknown[]> {
    try {
        const stocks = await fetchStocksAll();
        return stocks;
    } catch (error) {
        console.error('Error fetching all PSE stocks:', error);
        return [];
    }
}

export function getPSEiSymbols(): string[] {
    return [
        'AC', 'ALI', 'AP', 'AREIT', 'BDO', 'BLOOM', 'BPI', 'CNVRG', 'DMC', 'EMP',
        'GLO', 'GTCAP', 'ICT', 'JFC', 'LTG', 'MBT', 'MEG', 'MER', 'MPI', 'PGOLD',
        'RRHI', 'SECB', 'SM', 'SMC', 'SMPH', 'TEL', 'URC', 'WLCON', 'MONDE', 'ACEN',
    ];
}

export function filterPSEiStocks(stocks: unknown[]): unknown[] {
    const pseiSymbols = new Set(getPSEiSymbols());
    // Try to filter objects with a symbol property
    return stocks.filter((stock: unknown) => {
        return typeof stock === 'object' && stock !== null && 'symbol' in stock && pseiSymbols.has((stock as { symbol: string }).symbol);
    });
}

// Export stock names for use in components
export { STOCK_NAMES };
