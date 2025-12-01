import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { OrderService } from './order.service';
import { AuthService } from './auth.service';
import { AuthStoreService } from '@app/store/auth-store.service';

describe('OrderService', () => {
    let service: OrderService;
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                OrderService,
                AuthService,
                AuthStoreService
            ]
        });

        service = TestBed.inject(OrderService);
        authService = TestBed.inject(AuthService);

        // Clear localStorage
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return error when placing order without authentication', (done) => {
        service.placeOrder('BTC-USDT', {
            side: 0,
            order_type: 0,
            price: 45000,
            size: 0.1
        }).subscribe(response => {
            expect(response.code).toBe('ERROR');
            expect(response.message).toContain('Not authenticated');
            done();
        });
    });

    it('should place limit buy order when authenticated', (done) => {
        // First login
        authService.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            service.placeLimitBuyOrder('BTC-USDT', 45000, 0.1)
                .subscribe(response => {
                    expect(response.code).toBe('0000000');
                    expect(response.data?.order_id).toBeDefined();
                    done();
                });
        });
    });

    it('should place limit sell order when authenticated', (done) => {
        authService.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            service.placeLimitSellOrder('BTC-USDT', 46000, 0.1)
                .subscribe(response => {
                    expect(response.code).toBe('0000000');
                    expect(response.data?.order_id).toBeDefined();
                    done();
                });
        });
    });

    it('should place market buy order when authenticated', (done) => {
        authService.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            service.placeMarketBuyOrder('BTC-USDT', 1000)
                .subscribe(response => {
                    expect(response.code).toBe('0000000');
                    expect(response.data?.order_id).toBeDefined();
                    done();
                });
        });
    });

    it('should place market sell order when authenticated', (done) => {
        authService.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            service.placeMarketSellOrder('BTC-USDT', 0.1)
                .subscribe(response => {
                    expect(response.code).toBe('0000000');
                    expect(response.data?.order_id).toBeDefined();
                    done();
                });
        });
    });

    it('should get open orders when authenticated', (done) => {
        authService.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            // Place an order first
            service.placeLimitBuyOrder('BTC-USDT', 45000, 0.1).subscribe(() => {
                // Then get open orders
                service.getOpenOrders('BTC-USDT').subscribe(response => {
                    expect(response.code).toBe('0000000');
                    expect(response.data?.result).toBeDefined();
                    expect(response.data?.result.length).toBeGreaterThan(0);
                    done();
                });
            });
        });
    });

    it('should cancel order when authenticated', (done) => {
        authService.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            // Place an order first
            service.placeLimitBuyOrder('BTC-USDT', 45000, 0.1).subscribe(orderResponse => {
                const orderId = orderResponse.data?.order_id;
                expect(orderId).toBeDefined();
                
                if (orderId) {
                    // Then cancel it
                    service.cancelOrder(orderId).subscribe(cancelResponse => {
                        expect(cancelResponse.code).toBe('0000000');
                        done();
                    });
                }
            });
        });
    });
});
