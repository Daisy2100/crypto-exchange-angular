import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { WalletService } from './wallet.service';
import { AuthService } from './auth.service';
import { AuthStoreService } from '@app/store/auth-store.service';

describe('WalletService', () => {
    let service: WalletService;
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                WalletService,
                AuthService,
                AuthStoreService
            ]
        });

        service = TestBed.inject(WalletService);
        authService = TestBed.inject(AuthService);

        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return empty array when not authenticated', (done) => {
        service.getBalances().subscribe(balances => {
            expect(balances).toEqual([]);
            done();
        });
    });

    it('should get balances when authenticated', (done) => {
        authService.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            service.getBalances().subscribe(balances => {
                expect(balances).toBeDefined();
                expect(balances.length).toBeGreaterThan(0);
                done();
            });
        });
    });

    it('should get specific balance', (done) => {
        authService.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            service.getBalance('BTC').subscribe(balance => {
                expect(balance).toBeDefined();
                expect(balance?.asset).toBe('BTC');
                done();
            });
        });
    });

    it('should get portfolio summary', (done) => {
        authService.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            service.getPortfolioSummary().subscribe(summary => {
                expect(summary).toBeDefined();
                expect(summary.totalAssets).toBeGreaterThan(0);
                expect(summary.balances).toBeDefined();
                done();
            });
        });
    });

    it('should format amount correctly', () => {
        expect(service.formatAmount(0)).toBe('0.00000000');
        expect(service.formatAmount(1.23456789)).toBe('1.23456789');
        expect(service.formatAmount(0.000000001)).toBe('< 0.00000001');
    });

    it('should format USD value correctly', () => {
        const formatted = service.formatUSDValue(1, 45000);
        expect(formatted).toContain('$');
        expect(formatted).toContain('45,000');
    });
});
