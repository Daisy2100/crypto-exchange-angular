
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarketTableComponent } from 'app/components/market-table/market-table.component';
import { apiMarkets } from 'app/api/api-markets';
import { AuthHttpService } from 'app/auth/auth-http.service';
import { ApiService } from 'app/services/api.service';

interface Market {
    market_name: string;
    latest_price: number;
    price_change_24h: number;
    total_volume_24h: number;
}

@Component({
    selector: 'app-markets',
    templateUrl: './markets.component.html',
    styleUrls: ['./markets.component.scss'],
    standalone: true,
    imports: [CommonModule, MarketTableComponent]
})

export class MarketsComponent implements OnInit, OnDestroy {
    $isLoadingSubscription = new Subscription();

    markets: Market[] = [];
    loading = false;
    error: string | null = null;
    refreshInterval: any;
    lastUpdated: string = '';

    constructor(
        private router: Router,
        private ApiService: ApiService,
    ) { }

    ngOnInit() {
        this.fetchMarketData();
        this.startAutoRefresh();
    }

    ngOnDestroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        this.$isLoadingSubscription.unsubscribe();
    }

    fetchMarketData() {
        this.loading = true;
        this.error = null;

        this.$isLoadingSubscription.add(
            this.ApiService.get(apiMarkets.markets()).subscribe({
                next: (response: any) => {
                    if (response?.code === '0000000') {
                        this.markets = response.data;
                        this.lastUpdated = new Date().toLocaleTimeString();
                    } else {
                        this.error = response?.message || 'Failed to fetch market data';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.error = err?.error?.message || err.message || 'Network error occurred';
                    this.loading = false;
                }
            })
        )
    }

    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.fetchMarketData();
        }, 30000);
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(price);
    }

    formatChange(change: number): string {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${(change * 100).toFixed(2)}%`;
    }

    formatVolume(volume: number): string {
        if (volume >= 1000000) {
            return `${(volume / 1000000).toFixed(2)}M`;
        } else if (volume >= 1000) {
            return `${(volume / 1000).toFixed(2)}K`;
        }
        return volume.toFixed(2);
    }

    selectMarket(event: any) {
        // PrimeNG 19: event 可能是 Market | Market[] | undefined
        const market = Array.isArray(event) ? event[0] : event;
        if (market && market.market_name) {
            this.router.navigate(['/markets', market.market_name]);
        }
    }

    // PrimeNG 19+ onRowSelect 事件直接傳 rowData
    onRowSelect(event: any) {
        this.selectMarket(event);
    }
}
