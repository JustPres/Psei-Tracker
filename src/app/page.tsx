'use client';

import { useEffect, useState } from 'react';
import { Stock } from '../types/stock.js';
import Navigation from '../components/Navigation';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import socket from '../lib/socket';
import { getPSEiSymbols, STOCK_NAMES } from '../lib/stocks';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const STOCKS = getPSEiSymbols();

// Define a StockUpdate type for socket updates
interface StockUpdate {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  volume: number;
}

export default function Home() {
  const [selected, setSelected] = useState("SM");
  const [stocksData, setStocksData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [history, setHistory] = useState<{
    [symbol: string]: { time: string[]; price: number[]; volume: number[] };
  }>({});

  // Fetch real-time stock data
  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stocks');
      const data = await response.json();

      if (data.stocks) {
        setStocksData(data.stocks);
        setLastUpdated(new Date(data.timestamp));
        console.log(`Fetched ${data.stocks.length} stocks with real-time data`);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStockData();

    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initialize history for all stocks
  useEffect(() => {
    setHistory(
      Object.fromEntries(
        STOCKS.map((s) => [s, { time: [], price: [], volume: [] }])
      )
    );

    const handler = (update: StockUpdate) => {
      setHistory((prev) => {
        const now = new Date().toLocaleTimeString();
        const prevData = prev[update.symbol] || {
          time: [],
          price: [],
          volume: [],
        };
        // Keep only last 30 points for performance
        const newTime = [...prevData.time, now].slice(-30);
        const newPrice = [...prevData.price, update.price].slice(-30);
        const newVolume = [...prevData.volume, update.volume].slice(-30);
        return {
          ...prev,
          [update.symbol]: {
            time: newTime,
            price: newPrice,
            volume: newVolume,
          },
        };
      });
    };
    socket.on("priceUpdate", handler);
    return () => { socket.off("priceUpdate", handler); };
  }, []);

  // Get current stock data for selected stock
  const selectedStockData = stocksData.find(stock => stock.symbol === selected);

  const chartData = {
    labels: history[selected]?.time || [],
    datasets: [
      {
        type: "line" as const,
        label: "Price",
        data: history[selected]?.price || [],
        borderColor: "rgb(0,255,0)",
        backgroundColor: "rgba(0,255,0,0.1)",
        yAxisID: "y",
        tension: 0.2,
        pointRadius: 0,
      },
      {
        type: "bar" as const,
        label: "Volume",
        data: history[selected]?.volume || [],
        backgroundColor: "rgba(0,0,255,0.3)",
        yAxisID: "y1",
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#fff" } },
      title: {
        display: true,
        text: `${selected} Real-Time Price & Volume`,
        color: "#fff",
      },
    },
    scales: {
      x: { ticks: { color: "#fff" }, grid: { color: "#444" } },
      y: {
        position: "left" as const,
        ticks: { color: "#fff" },
        grid: { color: "#444" },
        title: { display: true, text: "Price", color: "#fff" },
      },
      y1: {
        position: "right" as const,
        ticks: { color: "#fff" },
        grid: { color: "#222" },
        title: { display: true, text: "Volume", color: "#fff" },
      },
    },
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Accessible Intro and How to Use */}
        <section className="mb-6 p-4 bg-blue-50 text-blue-900 rounded" aria-labelledby="intro-heading">
          <h2 id="intro-heading" className="text-xl font-bold mb-2">Welcome to the PSEI Tracker!</h2>
          <p>
            This dashboard shows real-time prices and trading volumes for all 30 Philippine PSEi stocks.<br />
            <b>How to use:</b> Select a stock below to see its price and volume history. Hover over the chart for details.
          </p>
          <ul className="mt-2 text-sm">
            <li><span className="inline-block w-4 h-1 bg-green-500 mr-2 align-middle"></span>Green line: Stock price</li>
            <li><span className="inline-block w-4 h-4 bg-blue-400 mr-2 align-middle"></span>Blue bars: Trading volume</li>
          </ul>
          <div className="mt-4 text-sm bg-blue-100 text-blue-900 p-3 rounded">
            <b>What do these terms mean?</b>
            <ul className="list-disc pl-5 mt-2">
              <li><b>Price:</b> The current value of one share of the stock. This is how much you would pay to buy (or receive if you sell) one share right now.</li>
              <li><b>Volume:</b> The total number of shares traded during a given period. High volume means lots of activity; low volume means fewer trades.</li>
              <li><b>Change:</b> How much the price has moved up or down compared to the previous value. Positive change means the price increased; negative means it decreased.</li>
            </ul>
          </div>
          {lastUpdated && (
            <div className="mt-2 text-xs text-blue-700">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
        </section>

        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-4 bg-yellow-50 text-yellow-900 rounded">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
              Loading real-time stock data...
            </div>
          </div>
        )}

        {/* Accessible Stock Selector */}
        <label htmlFor="stock-select" className="sr-only">Select stock</label>
        <select
          id="stock-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="mb-4 p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Select stock to display"
        >
          {STOCKS.map((s) => (
            <option key={s} value={s}>
              {s} - {STOCK_NAMES[s]}
            </option>
          ))}
        </select>

        {/* Current Stock Info */}
        {selectedStockData && (
          <div className="mb-4 p-4 bg-gray-800 rounded">
            <h3 className="text-lg font-bold mb-2">{selectedStockData.symbol} - {selectedStockData.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Current Price:</span>
                <div className="text-xl font-bold">₱{selectedStockData.price?.toFixed(2) || 'N/A'}</div>
              </div>
              <div>
                <span className="text-gray-400">Change:</span>
                <div className={`text-lg font-bold ${(selectedStockData.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(selectedStockData.change || 0) >= 0 ? '+' : ''}{(selectedStockData.change || 0).toFixed(2)} ({(selectedStockData.percentChange || 0) >= 0 ? '+' : ''}{(selectedStockData.percentChange || 0).toFixed(2)}%)
                </div>
              </div>
              <div>
                <span className="text-gray-400">Volume:</span>
                <div className="text-lg">{(selectedStockData.volume || 0).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-400">Last Updated:</span>
                <div className="text-sm">
                  {selectedStockData.lastUpdated
                    ? (typeof selectedStockData.lastUpdated === 'string'
                      ? new Date(selectedStockData.lastUpdated).toLocaleTimeString()
                      : selectedStockData.lastUpdated.toLocaleTimeString())
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessible Chart Container */}
        <div
          className="bg-gray-800 p-4 rounded shadow mb-8"
          role="region"
          aria-label={`Real-time price and volume chart for ${selected} stock`}
          tabIndex={0}
        >
          <Line data={chartData as unknown} options={chartOptions} />
        </div>

        {/* Accessible Table for All Stocks */}
        <section aria-labelledby="table-heading">
          <h2 id="table-heading" className="text-lg font-bold mb-2">All PSEi Stocks - Real-Time Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-gray-800 text-white" role="table">
              <thead className="bg-gray-700" role="rowgroup">
                <tr role="row">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Symbol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Change</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">% Change</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Volume</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700" role="rowgroup">
                {stocksData.map((stock) => (
                  <tr key={stock.symbol} role="row" className="hover:bg-gray-700 cursor-pointer" onClick={() => setSelected(stock.symbol)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" role="cell">
                      <span title={stock.name}>{stock.symbol}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" role="cell">{stock.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold" role="cell">
                      ₱{stock.price?.toFixed(2) || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${(stock.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`} role="cell">
                      {(stock.change || 0) >= 0 ? '+' : ''}{(stock.change || 0).toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${(stock.percentChange || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`} role="cell">
                      {(stock.percentChange || 0) >= 0 ? '+' : ''}{(stock.percentChange || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" role="cell">
                      {(stock.volume || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchStockData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh stock data"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </main>
  );
}
