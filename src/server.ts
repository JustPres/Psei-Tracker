import { Server } from 'socket.io';
import { createServer } from 'http';
import type { Stock } from './types/stock.d.ts';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Store last known prices
let lastPrices: { [symbol: string]: number } = {};

// Mock stock data for real-time updates
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

// Function to generate realistic price changes
function generatePriceChange(currentPrice: number): { change: number; percentChange: number } {
    const maxChangePercent = 1.5; // Max 1.5% change
    const changePercent = (Math.random() - 0.5) * maxChangePercent;
    const change = (currentPrice * changePercent) / 100;
    return {
        change: parseFloat(change.toFixed(2)),
        percentChange: parseFloat(changePercent.toFixed(2))
    };
}

// Function to update stock prices
function updateStockPrices(): void {
    mockStocks.forEach(stock => {
        const { change, percentChange } = generatePriceChange(stock.price);
        const newPrice = stock.price + change;
        const volume = Math.floor(Math.random() * 200000) + 10000;

        // Update the stock
        stock.price = parseFloat(newPrice.toFixed(2));
        stock.change = change;
        stock.percentChange = percentChange;
        stock.volume = volume;
        stock.lastUpdated = new Date();

        // Emit update to connected clients
        io.emit('priceUpdate', {
            symbol: stock.symbol,
            price: stock.price,
            change: stock.change,
            percentChange: stock.percentChange,
            volume: stock.volume
        });
    });

    console.log(`Updated ${mockStocks.length} stock prices`);
}

// Update prices every 10 seconds (much more reasonable)
setInterval(updateStockPrices, 10000);

io.on('connection', (socket) => {
    console.log('Client connected');

    // Send initial data to new client
    socket.emit('initialData', mockStocks);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.REALTIME_PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Real-time server running on port ${PORT}`);
    console.log('Using mock data service - no web scraping, no lag!');
});
