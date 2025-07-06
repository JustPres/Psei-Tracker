export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    percentChange: number;
    volume: number;
    lastUpdated: Date;
}

export interface WatchlistItem {
    userId: string;
    symbol: string;
    addedAt: Date;
}
