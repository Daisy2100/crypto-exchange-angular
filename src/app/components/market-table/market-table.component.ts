import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { TranslatePipe } from 'app/core/i18n/translate.pipe';
import { TableModule } from 'primeng/table';
import { ApiService } from 'app/services/api.service';
import { apiMarkets } from 'app/api/api-markets';

interface Market {
    market_name: string;
    latest_price: number;
    price_change_24h: number;
    total_volume_24h: number;
}

@Component({
    selector: 'app-market-table',
    templateUrl: './market-table.component.html',
    styleUrls: ['./market-table.component.scss'],
    standalone: true,
    imports: [CommonModule, NgClass, TableModule, TranslatePipe]
})

export class MarketTableComponent implements OnInit, OnDestroy {
    markets: Market[] = [];
    loading = false;
    error: string | null = null;
    refreshInterval: any;
    lastUpdated: string = '';

    constructor(private router: Router, private apiService: ApiService) { }

    ngOnInit() {
        this.fetchMarketData();
        this.startAutoRefresh();
    }

    ngOnDestroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }

    fetchMarketData() {
        this.loading = true;
        this.error = null;
        this.apiService.get(apiMarkets.markets()).subscribe({
            next: (response: any) => {
                if (response?.code === '0000000') {
                    this.markets = response.data;
                    this.lastUpdated = new Date().toLocaleTimeString();
                } else {
                    this.error = response?.message || 'Failed to fetch market data';
                }
                this.loading = false;
            },
            error: (err: any) => {
                this.error = err?.error?.message || err.message || 'Network error occurred';
                this.loading = false;
            }
        });
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
        const market = Array.isArray(event) ? event[0] : event;
        if (market && market.market_name) {
            // 導航到帶交易對參數的市場訂單頁面
            this.router.navigate(['/market-order', market.market_name]);
        }
    }

    navigateToMarketOrder(tradingPair: string) {
        if (tradingPair) {
            // 導航到帶交易對參數的市場訂單頁面
            this.router.navigate(['/market-order', tradingPair]);
        }
    }
}
