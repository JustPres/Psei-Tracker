'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Stock } from '@/types/stock';
import Navigation from '@/components/Navigation';
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc,
} from '@firebase/firestore';

export default function Watchlist() {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchWatchlist = async () => {
            try {
                const q = query(
                    collection(db, 'watchlist'),
                    where('userId', '==', user.uid)
                );
                await getDocs(q);

                // For now, we'll just use mock data
                // In a real app, you would fetch the actual stock data
                const mockStock: Stock = {
                    symbol: 'SM',
                    name: 'SM Investments Corporation',
                    price: 1025.00,
                    change: 15.50,
                    percentChange: 1.52,
                    volume: 125000,
                    lastUpdated: new Date(),
                };

                setWatchlist([mockStock]);
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [user]);

    // Remove or comment out unused variables 'querySnapshot' and 'addToWatchlist'
    // const addToWatchlist = async (stock: Stock) => {
    //     if (!user) return;
    //
    //     try {
    //         const watchlistItem: WatchlistItem = {
    //             userId: user.uid,
    //             symbol: stock.symbol,
    //             addedAt: new Date(),
    //         };
    //
    //         await addDoc(collection(db, 'watchlist'), watchlistItem);
    //         setWatchlist([...watchlist, stock]);
    //     } catch (error) {
    //         console.error('Error adding to watchlist:', error);
    //     }
    // };

    const removeFromWatchlist = async (symbol: string) => {
        if (!user) return;

        try {
            const q = query(
                collection(db, 'watchlist'),
                where('userId', '==', user.uid),
                where('symbol', '==', symbol)
            );
            await getDocs(q);

            setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol));
        } catch (error) {
            console.error('Error removing from watchlist:', error);
        }
    };

    if (!user) {
        return (
            <main className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Watchlist</h2>
                        <p>Please sign in to access your watchlist.</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : watchlist.length === 0 ? (
                    <div className="text-center py-8">
                        <p>Your watchlist is empty.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Symbol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Change
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Volume
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {watchlist.map((stock) => (
                                    <tr key={stock.symbol}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {stock.symbol}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {stock.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                                            ₱{stock.price.toFixed(2)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stock.change >= 0 ? '+' : ''}
                                            {stock.change.toFixed(2)} ({stock.percentChange.toFixed(2)}%)
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                            {stock.volume.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            <button
                                                onClick={() => removeFromWatchlist(stock.symbol)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
