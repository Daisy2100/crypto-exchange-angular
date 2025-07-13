// API 回應的基本介面
export interface ApiResponse<T = any> {
    code: string;
    message?: string;
    data?: T;
}

// 訂單簿相關介面
export interface OrderBookItem {
    price: string;
    volume: string;
}

export interface OrderBookData {
    bids: OrderBookItem[];
    asks: OrderBookItem[];
    timestamp?: number;
}

// 市場數據介面
export interface MarketData {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    price: string;
    priceChange: string;
    priceChangePercent: string;
    volume: string;
    high: string;
    low: string;
    open: string;
}

// K線資料介面
export interface KlineData {
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime?: number;
}
