import { ApiResponse, OrderBookData, MarketData, KlineData } from '@models/api-response.interface';

const API_BASE = 'api/v1';

export const apiMarkets = {
    // 市場相關API
    markets: () => `${API_BASE}/markets`,
    marketTicker: (symbol: string) => `${API_BASE}/markets/${symbol}/ticker`,

    // 訂單簿API - 按照您提供的規格
    orderbooks: (market: string) => `${API_BASE}/orderbooks/${market}/snapshot`,

    // K線圖API (未來可能需要)
    klines: (symbol: string, interval: string, limit?: number) => {
        const params = limit ? `?interval=${interval}&limit=${limit}` : `?interval=${interval}`;
        return `${API_BASE}/klines/${symbol}${params}`;
    }
};

// 類型導出，供其他模組使用
export type { ApiResponse, OrderBookData, MarketData, KlineData };
