'use client';

import { useEffect, useState } from 'react';
import { Stock } from '../types/stock.js';
import { useAuth } from '../contexts/AuthContext';
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

const STOCKS = [
  'AC', 'ALI', 'AP', 'AREIT', 'BDO', 'BLOOM', 'BPI', 'CNVRG', 'DMC', 'EMP',
  'GLO', 'GTCAP', 'ICT', 'JFC', 'LTG', 'MBT', 'MEG', 'MER', 'MPI', 'PGOLD',
  'RRHI', 'SECB', 'SM', 'SMC', 'SMPH', 'TEL', 'URC', 'WLCON', 'MONDE', 'ACEN',
];

const STOCK_NAMES: { [symbol: string]: string } = {
  AC: 'Ayala Corporation',
  ALI: 'Ayala Land, Inc.',
  AP: 'Aboitiz Power Corporation',
  AREIT: 'AREIT, Inc.',
  BDO: 'BDO Unibank, Inc.',
  BLOOM: 'Bloomberry Resorts Corporation',
  BPI: 'Bank of the Philippine Islands',
  CNVRG: 'Converge ICT Solutions, Inc.',
  DMC: 'DMCI Holdings, Inc.',
  EMP: 'Emperador Inc.',
  GLO: 'Globe Telecom, Inc.',
  GTCAP: 'GT Capital Holdings, Inc.',
  ICT: 'International Container Terminal Services, Inc.',
  JFC: 'Jollibee Foods Corporation',
  LTG: 'LT Group, Inc.',
  MBT: 'Metropolitan Bank & Trust Company',
  MEG: 'Megaworld Corporation',
  MER: 'Manila Electric Company',
  MPI: 'Metro Pacific Investments Corporation',
  PGOLD: 'Puregold Price Club, Inc.',
  RRHI: 'Robinsons Retail Holdings, Inc.',
  SECB: 'Security Bank Corporation',
  SM: 'SM Investments Corporation',
  SMC: 'San Miguel Corporation',
  SMPH: 'SM Prime Holdings, Inc.',
  TEL: 'PLDT Inc.',
  URC: 'Universal Robina Corporation',
  WLCON: 'Wilcon Depot, Inc.',
  MONDE: 'Monde Nissin Corporation',
  ACEN: 'ACEN Corporation',
};

export default function Home() {
  const { user } = useAuth();
  const [selected, setSelected] = useState("SM");
  const [history, setHistory] = useState<{
    [symbol: string]: { time: string[]; price: number[]; volume: number[] };
  }>({});

  useEffect(() => {
    // Initialize history for all stocks
    setHistory(
      Object.fromEntries(
        STOCKS.map((s) => [s, { time: [], price: [], volume: [] }])
      )
    );

    const handler = (update: any) => {
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
            This dashboard shows real-time prices and trading volumes for the top 10 Philippine stocks.<br />
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
        </section>
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
              {s}
            </option>
          ))}
        </select>
        {/* Accessible Chart Container */}
        <div
          className="bg-gray-800 p-4 rounded shadow mb-8"
          role="region"
          aria-label={`Real-time price and volume chart for ${selected} stock`}
          tabIndex={0}
        >
          <Line data={chartData as any} options={chartOptions} />
        </div>
        {/* Accessible Table for All Stocks */}
        <section aria-labelledby="table-heading">
          <h2 id="table-heading" className="text-lg font-bold mb-2">All Stocks Table</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-gray-800 text-white" role="table">
              <thead className="bg-gray-700" role="rowgroup">
                <tr role="row">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Symbol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Change</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Volume</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700" role="rowgroup">
                {STOCKS.map((symbol) => (
                  <tr key={symbol} role="row">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" role="cell">
                      <span title={STOCK_NAMES[symbol] || symbol}>{symbol}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" role="cell">{symbol}.PS</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" role="cell">
                      {history[symbol]?.price?.length ? `₱${history[symbol].price[history[symbol].price.length - 1].toFixed(2)}` : '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${history[symbol]?.price?.length && history[symbol]?.price[history[symbol].price.length - 1] - (history[symbol].price[history[symbol].price.length - 2] || 0) > 0 ? 'text-green-400' : history[symbol]?.price?.length && history[symbol]?.price[history[symbol].price.length - 1] - (history[symbol].price[history[symbol].price.length - 2] || 0) < 0 ? 'text-red-400' : 'text-gray-300'}`}
                      role="cell">
                      {history[symbol]?.price?.length > 1
                        ? `${(history[symbol].price[history[symbol].price.length - 1] - history[symbol].price[history[symbol].price.length - 2]).toFixed(2)}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right" role="cell">
                      {history[symbol]?.volume?.length ? history[symbol].volume[history[symbol].volume.length - 1].toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
