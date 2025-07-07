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
// const lastPrices: { [symbol: string]: number } = {};

// Mock stock data for real-time updates
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
