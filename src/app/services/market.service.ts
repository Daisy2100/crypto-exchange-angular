import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, interval } from 'rxjs';
import { map, catchError, tap, switchMap, shareReplay } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { WebSocketService } from './websocket.service';

export interface Market {
    market_name: string;
    latest_price: number;
    price_change_24h: number;
    total_volume_24h: number;
    high_24h?: number;
    low_24h?: number;
    base_asset?: string;
    quote_asset?: string;
}

export interface OrderBookEntry {
    price: number;
    volume: number;
}

export interface OrderBook {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
    latest_price: number;
    timestamp?: number;
}

export interface KlineData {
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime?: number;
}

export interface MarketsResponse {
    code: string;
    message?: string;
    data?: Market[];
}

export interface OrderBookResponse {
    code: string;
    message?: string;
    data?: {
        bid_side: any[];
        ask_side: any[];
        latest_price: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class MarketService {
    private baseUrl = environment.apiUrl;
    private mockMode = environment.mockBackend;

    // Cached markets
    private _markets$ = new BehaviorSubject<Market[]>([]);
    public markets$ = this._markets$.asObservable();

    // Selected market
    private _selectedMarket$ = new BehaviorSubject<Market | null>(null);
    public selectedMarket$ = this._selectedMarket$.asObservable();

    // Loading state
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    public isLoading$ = this._isLoading$.asObservable();

    // Mock markets data
    private mockMarkets: Market[] = [
        {
            market_name: 'BTC-USDT',
            latest_price: 65234.56,
            price_change_24h: 0.0245,
            total_volume_24h: 1234567890,
            high_24h: 66000,
            low_24h: 64000,
            base_asset: 'BTC',
            quote_asset: 'USDT'
        },
        {
            market_name: 'ETH-USDT',
            latest_price: 3456.78,
            price_change_24h: -0.0123,
            total_volume_24h: 567890123,
            high_24h: 3550,
            low_24h: 3400,
            base_asset: 'ETH',
            quote_asset: 'USDT'
        },
        {
            market_name: 'SOL-USDT',
            latest_price: 156.23,
            price_change_24h: 0.0567,
            total_volume_24h: 89012345,
            high_24h: 160,
            low_24h: 150,
            base_asset: 'SOL',
            quote_asset: 'USDT'
        },
        {
            market_name: 'ADA-USDT',
            latest_price: 0.5234,
            price_change_24h: -0.0089,
            total_volume_24h: 34567890,
            high_24h: 0.55,
            low_24h: 0.50,
            base_asset: 'ADA',
            quote_asset: 'USDT'
        },
        {
            market_name: 'DOT-USDT',
            latest_price: 7.89,
            price_change_24h: 0.0234,
            total_volume_24h: 12345678,
            high_24h: 8.20,
            low_24h: 7.60,
            base_asset: 'DOT',
            quote_asset: 'USDT'
        }
    ];

    constructor(
        private http: HttpClient,
        private wsService: WebSocketService
    ) {
        // Initialize with mock data
        if (this.mockMode) {
            this._markets$.next(this.mockMarkets);
            this.startMockPriceUpdates();
        }
    }

    /**
     * Get all markets
     */
    getMarkets(): Observable<Market[]> {
        if (this.mockMode) {
            return of(this.mockMarkets).pipe(
                tap(markets => this._markets$.next(markets))
            );
        }

        this._isLoading$.next(true);

        return this.http.get<MarketsResponse>(`${this.baseUrl}/api/v1/markets`).pipe(
            map(response => {
                if (response.code === '0000000' && response.data) {
                    this._markets$.next(response.data);
                    return response.data;
                }
                return [];
            }),
            catchError(error => {
                console.error('Failed to fetch markets:', error);
                // Return mock data as fallback
                this._markets$.next(this.mockMarkets);
                return of(this.mockMarkets);
            }),
            tap(() => this._isLoading$.next(false))
        );
    }

    /**
     * Get a specific market by name
     */
    getMarket(marketName: string): Observable<Market | null> {
        return this.getMarkets().pipe(
            map(markets => markets.find(m => m.market_name === marketName) || null)
        );
    }

    /**
     * Get order book for a market
     */
    getOrderBook(market: string): Observable<OrderBook | null> {
        if (this.mockMode) {
            return this.getMockOrderBook(market);
        }

        const symbol = market.replace('-', '');
        return this.http.get<OrderBookResponse>(`${this.baseUrl}/api/v1/orderbooks/${symbol}/snapshot`).pipe(
            map(response => {
                if (response.code === '0000000' && response.data) {
                    const data = response.data;
                    return {
                        bids: this.transformOrderBookSide(data.bid_side || []),
                        asks: this.transformOrderBookSide(data.ask_side || []),
                        latest_price: data.latest_price,
                        timestamp: Date.now()
                    };
                }
                return null;
            }),
            catchError(error => {
                console.error('Failed to fetch order book:', error);
                return this.getMockOrderBook(market);
            })
        );
    }

    /**
     * Get K-line/candlestick data
     */
    getKlineData(market: string, interval: string = '15m', limit: number = 100): Observable<KlineData[]> {
        if (this.mockMode) {
            return this.getMockKlineData();
        }

        const symbol = market.replace('-', '');
        return this.http.get<any>(`${this.baseUrl}/api/v1/markets/${symbol}/ohlcv-history/${interval}`).pipe(
            map(response => {
                if (response.code === '0000000' && response.data) {
                    return response.data;
                }
                return [];
            }),
            catchError(error => {
                console.error('Failed to fetch K-line data:', error);
                return this.getMockKlineData();
            })
        );
    }

    /**
     * Set the selected market
     */
    setSelectedMarket(market: Market | null): void {
        this._selectedMarket$.next(market);
    }

    /**
     * Get selected market's assets
     */
    getMarketAssets(marketName: string): { base: string; quote: string } {
        const parts = marketName.split('-');
        return {
            base: parts[0] || '',
            quote: parts[1] || ''
        };
    }

    /**
     * Format price with appropriate precision
     */
    formatPrice(price: number): string {
        if (price >= 10000) {
            return price.toFixed(2);
        } else if (price >= 100) {
            return price.toFixed(4);
        } else if (price >= 1) {
            return price.toFixed(6);
        } else {
            return price.toFixed(8);
        }
    }

    /**
     * Format percentage change
     */
    formatChange(change: number): string {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${(change * 100).toFixed(2)}%`;
    }

    /**
     * Format volume
     */
    formatVolume(volume: number): string {
        if (volume >= 1000000000) {
            return `${(volume / 1000000000).toFixed(2)}B`;
        } else if (volume >= 1000000) {
            return `${(volume / 1000000).toFixed(2)}M`;
        } else if (volume >= 1000) {
            return `${(volume / 1000).toFixed(2)}K`;
        }
        return volume.toFixed(2);
    }

    // ==================== Private Methods ====================

    private transformOrderBookSide(side: any[]): OrderBookEntry[] {
        return side.map(entry => ({
            price: parseFloat(entry.price) || entry.price,
            volume: parseFloat(entry.volume) || entry.volume
        }));
    }

    private startMockPriceUpdates(): void {
        // Update mock prices every 3 seconds
        interval(3000).pipe(
            tap(() => {
                this.mockMarkets = this.mockMarkets.map(market => {
                    const change = (Math.random() - 0.5) * 0.02;
                    const newPrice = market.latest_price * (1 + change);
                    return {
                        ...market,
                        latest_price: newPrice,
                        price_change_24h: market.price_change_24h + (Math.random() - 0.5) * 0.001
                    };
                });
                this._markets$.next(this.mockMarkets);
            })
        ).subscribe();
    }

    private getMockOrderBook(market: string): Observable<OrderBook> {
        const currentMarket = this.mockMarkets.find(m => m.market_name === market);
        const basePrice = currentMarket?.latest_price || 45000;

        const bids: OrderBookEntry[] = [];
        const asks: OrderBookEntry[] = [];

        // Generate bids (below current price)
        for (let i = 0; i < 10; i++) {
            const price = basePrice * (1 - (i + 1) * 0.001);
            const volume = Math.random() * 10;
            bids.push({ price, volume });
        }

        // Generate asks (above current price)
        for (let i = 0; i < 10; i++) {
            const price = basePrice * (1 + (i + 1) * 0.001);
            const volume = Math.random() * 10;
            asks.push({ price, volume });
        }

        return of({
            bids,
            asks,
            latest_price: basePrice,
            timestamp: Date.now()
        });
    }

    private getMockKlineData(): Observable<KlineData[]> {
        const data: KlineData[] = [];
        const basePrice = 45000 + Math.random() * 20000;
        const now = Date.now();

        for (let i = 99; i >= 0; i--) {
            const time = now - (i * 15 * 60 * 1000);
            const volatility = (Math.random() - 0.5) * 0.02;
            const open = basePrice * (1 + volatility);
            const change = (Math.random() - 0.5) * 0.01;
            const close = open * (1 + change);
            const high = Math.max(open, close) * (1 + Math.random() * 0.005);
            const low = Math.min(open, close) * (1 - Math.random() * 0.005);

            data.push({
                openTime: time,
                open: open.toFixed(2),
                high: high.toFixed(2),
                low: low.toFixed(2),
                close: close.toFixed(2),
                volume: (Math.random() * 100).toFixed(4)
            });
        }

        return of(data);
    }
}
