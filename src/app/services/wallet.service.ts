import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AuthService } from './auth.service';

export interface Balance {
    asset: string;
    available: number;
    locked: number;
    total: number;
}

export interface BalancesResponse {
    code: string;
    message?: string;
    data?: Balance[];
}

@Injectable({
    providedIn: 'root'
})
export class WalletService {
    private baseUrl = environment.apiUrl;
    private mockMode = environment.mockBackend;

    // Cached balances
    private _balances$ = new BehaviorSubject<Balance[]>([]);
    public balances$ = this._balances$.asObservable();

    // Loading state
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    public isLoading$ = this._isLoading$.asObservable();

    // Mock balances for demonstration
    private mockBalances: Balance[] = [
        { asset: 'BTC', available: 1.5, locked: 0.1, total: 1.6 },
        { asset: 'ETH', available: 10.0, locked: 0.5, total: 10.5 },
        { asset: 'USDT', available: 50000, locked: 1000, total: 51000 },
        { asset: 'SOL', available: 100, locked: 0, total: 100 },
        { asset: 'ADA', available: 5000, locked: 0, total: 5000 },
        { asset: 'DOT', available: 200, locked: 10, total: 210 }
    ];

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        // Initialize mock balances
        if (this.mockMode) {
            this._balances$.next(this.mockBalances);
        }
    }

    /**
     * Get all balances
     */
    getBalances(): Observable<Balance[]> {
        if (!this.authService.isAuthenticated()) {
            return of([]);
        }

        if (this.mockMode) {
            return of(this.mockBalances).pipe(
                tap(balances => this._balances$.next(balances))
            );
        }

        this._isLoading$.next(true);

        return this.http.get<BalancesResponse>(`${this.baseUrl}/api/v1/balances`).pipe(
            map(response => {
                if (response.code === '0000000' && response.data) {
                    this._balances$.next(response.data);
                    return response.data;
                }
                return [];
            }),
            catchError(error => {
                console.error('Failed to fetch balances:', error);
                return of([]);
            }),
            tap(() => this._isLoading$.next(false))
        );
    }

    /**
     * Get balance for a specific asset
     */
    getBalance(asset: string): Observable<Balance | null> {
        return this.getBalances().pipe(
            map(balances => balances.find(b => b.asset === asset) || null)
        );
    }

    /**
     * Get available balance for a specific asset
     */
    getAvailableBalance(asset: string): number {
        const balance = this._balances$.value.find(b => b.asset === asset);
        return balance?.available || 0;
    }

    /**
     * Get total balance for a specific asset
     */
    getTotalBalance(asset: string): number {
        const balance = this._balances$.value.find(b => b.asset === asset);
        return balance?.total || 0;
    }

    /**
     * Refresh balances
     */
    refreshBalances(): Observable<Balance[]> {
        return this.getBalances();
    }

    /**
     * Get summary of all assets
     */
    getPortfolioSummary(): Observable<{
        totalAssets: number;
        nonZeroBalances: number;
        balances: Balance[];
    }> {
        return this.getBalances().pipe(
            map(balances => ({
                totalAssets: balances.length,
                nonZeroBalances: balances.filter(b => b.total > 0).length,
                balances
            }))
        );
    }

    /**
     * Update mock balance (for testing)
     */
    updateMockBalance(asset: string, available: number, locked: number = 0): void {
        if (!this.mockMode) return;

        const index = this.mockBalances.findIndex(b => b.asset === asset);
        const newBalance = {
            asset,
            available,
            locked,
            total: available + locked
        };

        if (index >= 0) {
            this.mockBalances[index] = newBalance;
        } else {
            this.mockBalances.push(newBalance);
        }

        this._balances$.next([...this.mockBalances]);
    }

    /**
     * Format balance amount
     */
    formatAmount(amount: number, decimals: number = 8): string {
        if (amount === 0) return '0.00000000';
        if (amount < 0.00000001) return '< 0.00000001';
        return amount.toFixed(decimals);
    }

    /**
     * Format balance in USD equivalent
     */
    formatUSDValue(amount: number, price: number): string {
        const value = amount * price;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
}
