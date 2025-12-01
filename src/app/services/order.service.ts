import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AuthService } from './auth.service';

export interface OrderRequest {
    side: 0 | 1;        // 0=Buy, 1=Sell
    order_type: 0 | 1;  // 0=Limit, 1=Market
    mode?: 0 | 1;       // 0=Maker, 1=Taker
    price?: number;     // Required for limit orders
    size?: number;      // Required for limit orders and market sell
    quote_amount?: number; // Required for market buy
}

export interface Order {
    id: string;
    market: string;
    side: 0 | 1;
    type: 0 | 1;
    mode?: 0 | 1;
    price?: number;
    original_size: number;
    remaining_size: number;
    avg_dealt_price?: number;
    fees?: number;
    fee_asset?: string;
    status: string;
    created_at?: string;
    updated_at?: string;
}

export interface OrdersResponse {
    code: string;
    message?: string;
    data?: {
        result: Order[];
        total_count?: number;
        current_page?: number;
        page_size?: number;
    };
}

export interface PlaceOrderResponse {
    code: string;
    message?: string;
    data?: {
        order_id: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private baseUrl = environment.apiUrl;
    private mockMode = environment.mockBackend;

    // Mock orders for demonstration
    private mockOpenOrders: Order[] = [];
    private mockClosedOrders: Order[] = [];
    private _ordersUpdated$ = new BehaviorSubject<void>(undefined);
    public ordersUpdated$ = this._ordersUpdated$.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    /**
     * Place a new order
     */
    placeOrder(market: string, orderData: OrderRequest): Observable<PlaceOrderResponse> {
        if (!this.authService.isAuthenticated()) {
            return of({ code: 'ERROR', message: 'Not authenticated' });
        }

        if (this.mockMode) {
            return this.mockPlaceOrder(market, orderData);
        }

        return this.http.post<PlaceOrderResponse>(
            `${this.baseUrl}/api/v1/orders/${market}`,
            orderData
        ).pipe(
            tap(() => this._ordersUpdated$.next()),
            catchError(error => of({
                code: 'ERROR',
                message: error?.error?.message || 'Order placement failed'
            }))
        );
    }

    /**
     * Place a limit buy order
     */
    placeLimitBuyOrder(market: string, price: number, size: number, mode: 0 | 1 = 1): Observable<PlaceOrderResponse> {
        return this.placeOrder(market, {
            side: 0,
            order_type: 0,
            mode,
            price,
            size
        });
    }

    /**
     * Place a limit sell order
     */
    placeLimitSellOrder(market: string, price: number, size: number, mode: 0 | 1 = 1): Observable<PlaceOrderResponse> {
        return this.placeOrder(market, {
            side: 1,
            order_type: 0,
            mode,
            price,
            size
        });
    }

    /**
     * Place a market buy order
     */
    placeMarketBuyOrder(market: string, quoteAmount: number): Observable<PlaceOrderResponse> {
        return this.placeOrder(market, {
            side: 0,
            order_type: 1,
            quote_amount: quoteAmount
        });
    }

    /**
     * Place a market sell order
     */
    placeMarketSellOrder(market: string, size: number): Observable<PlaceOrderResponse> {
        return this.placeOrder(market, {
            side: 1,
            order_type: 1,
            size
        });
    }

    /**
     * Cancel an order
     */
    cancelOrder(orderId: string): Observable<{ code: string; message?: string }> {
        if (!this.authService.isAuthenticated()) {
            return of({ code: 'ERROR', message: 'Not authenticated' });
        }

        if (this.mockMode) {
            return this.mockCancelOrder(orderId);
        }

        return this.http.delete<{ code: string; message?: string }>(
            `${this.baseUrl}/api/v1/orders/${orderId}`
        ).pipe(
            tap(() => this._ordersUpdated$.next()),
            catchError(error => of({
                code: 'ERROR',
                message: error?.error?.message || 'Order cancellation failed'
            }))
        );
    }

    /**
     * Get open orders
     */
    getOpenOrders(market?: string, side?: 0 | 1, pageSize: number = 10, currentPage: number = 1): Observable<OrdersResponse> {
        if (!this.authService.isAuthenticated()) {
            return of({ code: 'ERROR', message: 'Not authenticated' });
        }

        if (this.mockMode) {
            return this.getMockOpenOrders(market);
        }

        const params: any = {
            type: 'OPENING',
            page_size: pageSize,
            current_page: currentPage
        };
        if (market) params.market = market;
        if (side !== undefined) params.side = side;

        return this.http.get<OrdersResponse>(`${this.baseUrl}/api/v1/orders`, { params }).pipe(
            catchError(error => of({
                code: 'ERROR',
                message: error?.error?.message || 'Failed to fetch orders'
            }))
        );
    }

    /**
     * Get closed/completed orders (order history)
     */
    getClosedOrders(market?: string, side?: 0 | 1, pageSize: number = 10, currentPage: number = 1): Observable<OrdersResponse> {
        if (!this.authService.isAuthenticated()) {
            return of({ code: 'ERROR', message: 'Not authenticated' });
        }

        if (this.mockMode) {
            return this.getMockClosedOrders(market);
        }

        const params: any = {
            type: 'CLOSED',
            page_size: pageSize,
            current_page: currentPage
        };
        if (market) params.market = market;
        if (side !== undefined) params.side = side;

        return this.http.get<OrdersResponse>(`${this.baseUrl}/api/v1/orders`, { params }).pipe(
            catchError(error => of({
                code: 'ERROR',
                message: error?.error?.message || 'Failed to fetch order history'
            }))
        );
    }

    // ==================== Mock Methods ====================

    private mockPlaceOrder(market: string, orderData: OrderRequest): Observable<PlaceOrderResponse> {
        const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        
        const newOrder: Order = {
            id: orderId,
            market,
            side: orderData.side,
            type: orderData.order_type,
            mode: orderData.mode,
            price: orderData.price,
            original_size: orderData.size || (orderData.quote_amount ? orderData.quote_amount / 45000 : 0),
            remaining_size: orderData.size || (orderData.quote_amount ? orderData.quote_amount / 45000 : 0),
            status: orderData.order_type === 1 ? 'FILLED' : 'PENDING',
            created_at: new Date().toISOString()
        };

        // Market orders go directly to history
        if (orderData.order_type === 1) {
            newOrder.avg_dealt_price = orderData.price || 45000;
            newOrder.fees = (newOrder.original_size || 0) * 0.001;
            newOrder.fee_asset = market.split('-')[1] || 'USDT';
            this.mockClosedOrders.unshift(newOrder);
        } else {
            this.mockOpenOrders.unshift(newOrder);
        }

        this._ordersUpdated$.next();

        return of({
            code: '0000000',
            message: 'Order placed successfully',
            data: { order_id: orderId }
        });
    }

    private mockCancelOrder(orderId: string): Observable<{ code: string; message?: string }> {
        const orderIndex = this.mockOpenOrders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) {
            return of({ code: 'ERROR', message: 'Order not found' });
        }

        const cancelledOrder = this.mockOpenOrders.splice(orderIndex, 1)[0];
        cancelledOrder.status = 'CANCELLED';
        cancelledOrder.updated_at = new Date().toISOString();
        this.mockClosedOrders.unshift(cancelledOrder);

        this._ordersUpdated$.next();

        return of({
            code: '0000000',
            message: 'Order cancelled successfully'
        });
    }

    private getMockOpenOrders(market?: string): Observable<OrdersResponse> {
        let orders = this.mockOpenOrders;
        if (market) {
            orders = orders.filter(o => o.market === market);
        }

        return of({
            code: '0000000',
            data: {
                result: orders,
                total_count: orders.length,
                current_page: 1,
                page_size: 10
            }
        });
    }

    private getMockClosedOrders(market?: string): Observable<OrdersResponse> {
        let orders = this.mockClosedOrders;
        if (market) {
            orders = orders.filter(o => o.market === market);
        }

        return of({
            code: '0000000',
            data: {
                result: orders,
                total_count: orders.length,
                current_page: 1,
                page_size: 10
            }
        });
    }
}
