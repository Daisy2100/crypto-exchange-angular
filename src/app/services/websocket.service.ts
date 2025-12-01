import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { takeUntil, retry } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface WebSocketMessage {
    channel: string;
    data: any;
    timestamp?: number;
}

export interface OhlcvData {
    candleData: CandleData[];
    volumeData: VolumeData[];
}

export interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface VolumeData {
    time: number;
    value: number;
    color: string;
}

export interface OrderBookUpdate {
    bids: Array<{ price: number; volume: number }>;
    asks: Array<{ price: number; volume: number }>;
    lastPrice?: number;
}

export interface ConnectionState {
    isConnected: boolean;
    reconnectAttempts: number;
    endpoint: string;
    subscribersCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
    private ws: WebSocket | null = null;
    private destroy$ = new Subject<void>();
    private messageQueue: any[] = [];
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private readonly reconnectDelay = 3000;

    // Connection state
    private _isConnected$ = new BehaviorSubject<boolean>(false);
    public isConnected$ = this._isConnected$.asObservable();

    // Channel subjects for different data streams
    private ohlcv$ = new Subject<OhlcvData>();
    private orderbook$ = new Subject<OrderBookUpdate>();
    private markets$ = new Subject<any>();
    private trades$ = new Subject<any>();

    // Mock mode configuration
    private mockMode = environment.mockBackend || false;
    private mockIntervals: Map<string, any> = new Map();

    // WebSocket endpoints
    private endpoints = {
        local: 'ws://localhost:8081/ws',
        remote: environment.wsUrl || 'ws://34.80.224.23:8081/ws'
    };
    private currentEndpoint = this.endpoints.remote;

    constructor() {
        // Auto-connect when service is instantiated
        this.connect();
    }

    ngOnDestroy(): void {
        this.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Connect to WebSocket server
     */
    connect(endpoint: 'local' | 'remote' = 'remote'): Promise<void> {
        if (this.mockMode) {
            console.log('WebSocket: Running in mock mode');
            this._isConnected$.next(true);
            return Promise.resolve();
        }

        if (this.ws && this._isConnected$.value) {
            console.log('WebSocket: Already connected');
            return Promise.resolve();
        }

        this.currentEndpoint = this.endpoints[endpoint];

        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.currentEndpoint);

                this.ws.onopen = () => {
                    console.log('WebSocket: Connected to', this.currentEndpoint);
                    this._isConnected$.next(true);
                    this.reconnectAttempts = 0;
                    this.processMessageQueue();
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data) as WebSocketMessage;
                        this.handleMessage(message);
                    } catch (error) {
                        console.error('WebSocket: Failed to parse message', error);
                    }
                };

                this.ws.onclose = (event) => {
                    console.log('WebSocket: Connection closed', event.code, event.reason);
                    this._isConnected$.next(false);

                    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.attemptReconnect();
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket: Connection error', error);
                    this._isConnected$.next(false);
                    reject(error);
                };

                // Connection timeout
                setTimeout(() => {
                    if (!this._isConnected$.value) {
                        reject(new Error('WebSocket: Connection timeout'));
                    }
                }, 10000);

            } catch (error) {
                console.error('WebSocket: Failed to connect', error);
                reject(error);
            }
        });
    }

    /**
     * Attempt to reconnect
     */
    private attemptReconnect(): void {
        this.reconnectAttempts++;
        console.log(`WebSocket: Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

        timer(this.reconnectDelay * this.reconnectAttempts)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.connect().catch(error => {
                    console.error('WebSocket: Reconnection failed', error);
                });
            });
    }

    /**
     * Process queued messages after connection
     */
    private processMessageQueue(): void {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.sendMessage(message);
        }
    }

    /**
     * Send a message through WebSocket
     */
    sendMessage(message: any): void {
        if (this.mockMode) {
            console.log('WebSocket Mock: Would send', message);
            return;
        }

        if (!this._isConnected$.value || !this.ws) {
            console.log('WebSocket: Not connected, queueing message');
            this.messageQueue.push(message);
            return;
        }

        try {
            this.ws.send(JSON.stringify(message));
            console.log('WebSocket: Sent message', message);
        } catch (error) {
            console.error('WebSocket: Failed to send message', error);
        }
    }

    /**
     * Handle incoming messages
     */
    private handleMessage(message: WebSocketMessage): void {
        console.log('WebSocket: Received message', message);

        const { channel, data, timestamp } = message;

        switch (channel) {
            case 'ohlcv':
                if (data?.s === 'ok') {
                    const transformedData = this.transformOhlcvData(data);
                    this.ohlcv$.next(transformedData);
                }
                break;
            case 'orderbook':
                this.orderbook$.next(data);
                break;
            case 'markets':
                this.markets$.next(data);
                break;
            case 'trades':
                this.trades$.next(data);
                break;
            default:
                console.warn('WebSocket: Unknown channel', channel);
        }
    }

    /**
     * Transform OHLCV data format
     */
    private transformOhlcvData(data: any): OhlcvData {
        const candleData: CandleData[] = [];
        const volumeData: VolumeData[] = [];

        if (data?.t && Array.isArray(data.t) && data.o && data.h && data.l && data.c && data.v) {
            for (let i = 0; i < data.t.length; i++) {
                const time = data.t[i];
                const open = data.o[i] ?? 0;
                const high = data.h[i] ?? 0;
                const low = data.l[i] ?? 0;
                const close = data.c[i] ?? 0;
                const volume = Math.abs(data.v[i] ?? 0);

                candleData.push({ time, open, high, low, close });
                volumeData.push({
                    time,
                    value: volume,
                    color: close >= open ? '#26a69a' : '#ef5350'
                });
            }
        }

        return { candleData, volumeData };
    }

    // ==================== Subscription Methods ====================

    /**
     * Subscribe to OHLCV data
     */
    subscribeOhlcv(symbol: string, interval: string): Observable<OhlcvData> {
        const subscribeMessage = {
            action: 'subscribe',
            channel: 'ohlcv',
            params: { symbol, interval }
        };

        this.sendMessage(subscribeMessage);
        console.log(`WebSocket: Subscribed to OHLCV ${symbol} ${interval}`);

        // If in mock mode, generate mock data
        if (this.mockMode) {
            this.startMockOhlcv(symbol, interval);
        }

        return this.ohlcv$.asObservable();
    }

    /**
     * Unsubscribe from OHLCV data
     */
    unsubscribeOhlcv(symbol: string, interval: string): void {
        const unsubscribeMessage = {
            action: 'unsubscribe',
            channel: 'ohlcv',
            params: { symbol, interval }
        };

        this.sendMessage(unsubscribeMessage);
        console.log(`WebSocket: Unsubscribed from OHLCV ${symbol} ${interval}`);

        // Stop mock data generation
        this.stopMock(`ohlcv-${symbol}-${interval}`);
    }

    /**
     * Subscribe to orderbook data
     */
    subscribeOrderbook(symbol: string): Observable<OrderBookUpdate> {
        const subscribeMessage = {
            action: 'subscribe',
            channel: 'orderbook',
            params: { symbol }
        };

        this.sendMessage(subscribeMessage);
        console.log(`WebSocket: Subscribed to Orderbook ${symbol}`);

        // If in mock mode, generate mock data
        if (this.mockMode) {
            this.startMockOrderbook(symbol);
        }

        return this.orderbook$.asObservable();
    }

    /**
     * Unsubscribe from orderbook data
     */
    unsubscribeOrderbook(symbol: string): void {
        const unsubscribeMessage = {
            action: 'unsubscribe',
            channel: 'orderbook',
            params: { symbol }
        };

        this.sendMessage(unsubscribeMessage);
        console.log(`WebSocket: Unsubscribed from Orderbook ${symbol}`);

        // Stop mock data generation
        this.stopMock(`orderbook-${symbol}`);
    }

    /**
     * Subscribe to market data
     */
    subscribeMarkets(): Observable<any> {
        const subscribeMessage = {
            action: 'subscribe',
            channel: 'markets'
        };

        this.sendMessage(subscribeMessage);
        console.log('WebSocket: Subscribed to Markets');

        if (this.mockMode) {
            this.startMockMarkets();
        }

        return this.markets$.asObservable();
    }

    /**
     * Unsubscribe from market data
     */
    unsubscribeMarkets(): void {
        const unsubscribeMessage = {
            action: 'unsubscribe',
            channel: 'markets'
        };

        this.sendMessage(unsubscribeMessage);
        console.log('WebSocket: Unsubscribed from Markets');

        this.stopMock('markets');
    }

    /**
     * Subscribe to trades data
     */
    subscribeTrades(symbol: string): Observable<any> {
        const subscribeMessage = {
            action: 'subscribe',
            channel: 'trades',
            params: { symbol }
        };

        this.sendMessage(subscribeMessage);
        console.log(`WebSocket: Subscribed to Trades ${symbol}`);

        return this.trades$.asObservable();
    }

    /**
     * Disconnect from WebSocket
     */
    disconnect(): void {
        // Stop all mock intervals
        this.mockIntervals.forEach((interval, key) => {
            clearInterval(interval);
        });
        this.mockIntervals.clear();

        if (this.ws) {
            console.log('WebSocket: Disconnecting');
            this.ws.close(1000, 'Client disconnecting');
            this.ws = null;
            this._isConnected$.next(false);
        }
    }

    /**
     * Get connection state
     */
    getConnectionState(): ConnectionState {
        return {
            isConnected: this._isConnected$.value,
            reconnectAttempts: this.reconnectAttempts,
            endpoint: this.currentEndpoint,
            subscribersCount: 0
        };
    }

    // ==================== Mock Data Generation ====================

    private startMockOhlcv(symbol: string, interval: string): void {
        const key = `ohlcv-${symbol}-${interval}`;
        if (this.mockIntervals.has(key)) return;

        let basePrice = 45000 + Math.random() * 20000;

        const generateData = () => {
            const candleData: CandleData[] = [];
            const volumeData: VolumeData[] = [];
            const now = Date.now();

            for (let i = 99; i >= 0; i--) {
                const time = now - (i * 15 * 60 * 1000);
                const volatility = (Math.random() - 0.5) * 0.02;
                const open = basePrice * (1 + volatility);
                const change = (Math.random() - 0.5) * 0.01;
                const close = open * (1 + change);
                const high = Math.max(open, close) * (1 + Math.random() * 0.005);
                const low = Math.min(open, close) * (1 - Math.random() * 0.005);
                const volume = Math.random() * 100;

                candleData.push({ time, open, high, low, close });
                volumeData.push({
                    time,
                    value: volume,
                    color: close >= open ? '#26a69a' : '#ef5350'
                });

                basePrice = close;
            }

            this.ohlcv$.next({ candleData, volumeData });
        };

        // Initial data
        generateData();

        // Update every 5 seconds for mock mode
        const intervalId = setInterval(generateData, 5000);
        this.mockIntervals.set(key, intervalId);
    }

    private startMockOrderbook(symbol: string): void {
        const key = `orderbook-${symbol}`;
        if (this.mockIntervals.has(key)) return;

        let lastPrice = 45000 + Math.random() * 20000;

        const generateData = () => {
            const bids: Array<{ price: number; volume: number }> = [];
            const asks: Array<{ price: number; volume: number }> = [];

            // Generate bids (below current price)
            for (let i = 0; i < 10; i++) {
                const price = lastPrice * (1 - (i + 1) * 0.001);
                const volume = Math.random() * 10;
                bids.push({ price, volume });
            }

            // Generate asks (above current price)
            for (let i = 0; i < 10; i++) {
                const price = lastPrice * (1 + (i + 1) * 0.001);
                const volume = Math.random() * 10;
                asks.push({ price, volume });
            }

            // Slightly move the price
            lastPrice = lastPrice * (1 + (Math.random() - 0.5) * 0.001);

            this.orderbook$.next({ bids, asks, lastPrice });
        };

        // Initial data
        generateData();

        // Update every 1 second for mock mode
        const intervalId = setInterval(generateData, 1000);
        this.mockIntervals.set(key, intervalId);
    }

    private startMockMarkets(): void {
        const key = 'markets';
        if (this.mockIntervals.has(key)) return;

        const markets = [
            { symbol: 'BTC-USDT', basePrice: 65000 },
            { symbol: 'ETH-USDT', basePrice: 3500 },
            { symbol: 'SOL-USDT', basePrice: 150 },
            { symbol: 'ADA-USDT', basePrice: 0.5 },
            { symbol: 'DOT-USDT', basePrice: 8 }
        ];

        const generateData = () => {
            const data = markets.map(m => {
                const change = (Math.random() - 0.5) * 0.1;
                const price = m.basePrice * (1 + change);
                const volume = Math.random() * 1000000;

                return {
                    market_name: m.symbol,
                    latest_price: price,
                    price_change_24h: change,
                    total_volume_24h: volume
                };
            });

            this.markets$.next(data);
        };

        // Initial data
        generateData();

        // Update every 3 seconds for mock mode
        const intervalId = setInterval(generateData, 3000);
        this.mockIntervals.set(key, intervalId);
    }

    private stopMock(key: string): void {
        const intervalId = this.mockIntervals.get(key);
        if (intervalId) {
            clearInterval(intervalId);
            this.mockIntervals.delete(key);
        }
    }

    /**
     * Toggle mock mode
     */
    setMockMode(enabled: boolean): void {
        this.mockMode = enabled;
        if (enabled) {
            console.log('WebSocket: Mock mode enabled');
            this._isConnected$.next(true);
        } else {
            // Stop all mocks and reconnect
            this.mockIntervals.forEach((interval) => clearInterval(interval));
            this.mockIntervals.clear();
            this.connect();
        }
    }
}
