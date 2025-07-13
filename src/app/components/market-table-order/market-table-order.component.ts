
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthHttpService } from '@auth/auth-http.service';
import { ApiService } from '@services/api.service';
import { apiMarkets, ApiResponse, OrderBookData } from '@api/api-markets';
import * as echarts from 'echarts';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-market-table-order',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        CardModule,
        DialogModule,
        InputTextModule,
        DecimalPipe
    ],
    templateUrl: './market-table-order.component.html',
    styleUrls: ['./market-table-order.component.scss']
})
export class MarketTableOrderComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() tradingPair: string = '';

    // 狀態
    chartInterval = '15m';
    latestPrice = 0.0;
    openOrders: any[] = [];
    orderHistory: any[] = [];
    orderType: 'limit' | 'market' = 'limit';
    market = '';
    placeOrderBtn: 'Buy' | 'Sell' = 'Buy';
    baseAsset = '';
    quoteAsset = '';
    baseBalance = 0;
    quoteBalance = 0;
    orderPercentage = 0;
    limitPrice = 0.0;
    limitAmount = 0.0;
    marketSellSize = 0.0;
    marketBuyAmount = 0.0;
    balances: any[] = [];
    bidSide: any[] = [];
    askSide: any[] = [];
    maxBidVolume = 1;
    maxAskVolume = 1;
    cmdOutputList: string[] = [];
    showModal = false;
    commonData = {
        data: {
            isLoggedIn: false,
            context: '',
            title: '',
        }
    };
    lastUpdated = '';
    loading = false;
    error: string | null = null;
    refreshInterval: any;
    private routeSub?: Subscription;
    klineData: any[] = [];

    @ViewChild('klineChart', { static: false }) klineChart!: ElementRef;
    private klineChartInstance: any;

    constructor(
        private auth: AuthHttpService,
        private api: ApiService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initializeMarket();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tradingPair'] && changes['tradingPair'].currentValue) {
            this.initializeMarket();
        }
    }

    private initializeMarket(): void {
        // 如果沒有從父組件傳入，則從路由獲取
        if (!this.tradingPair) {
            this.route.params.subscribe(params => {
                this.tradingPair = params['tradingPair'] || '';
                this.setupMarket();
            });
        } else {
            this.setupMarket();
        }
    }

    private setupMarket(): void {
        if (!this.tradingPair) return;

        this.market = this.tradingPair;
        // 解析交易對，例如 "BTC/USDT" -> baseAsset: "BTC", quoteAsset: "USDT"
        const [base, quote] = this.tradingPair.split('/');
        this.baseAsset = base || '';
        this.quoteAsset = quote || '';

        // 獲取市場數據
        this.fetchKlineData();
        this.fetchOrderBook();
        this.limitPrice = this.latestPrice;
        this.fetchOpenOrders();
        this.fetchClosedOrders();
        this.fetchBalances();
        this.startAutoRefresh();
        this.cmdOutputList.push(`C: \\CryptoEx> trading ${this.baseAsset}/${this.quoteAsset}\nLoading market data...`);

        if (this.auth.isAuthenticated()) {
            this.limitPrice = this.askSide[0] ? this.askSide[0].price : 0.0;
            this.orderPercentage = 0;
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initKlineChart();
        }, 200);
        window.addEventListener('resize', this.handleResize);
    }

    ngOnDestroy(): void {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        if (this.routeSub) this.routeSub.unsubscribe();
        window.removeEventListener('resize', this.handleResize);
        if (this.klineChartInstance) {
            this.klineChartInstance.dispose();
        }
    }

    // K線圖初始化
    private initKlineChart() {
        if (!this.klineChart || !this.klineChart.nativeElement) return;
        this.klineChartInstance = echarts.init(this.klineChart.nativeElement);
        this.updateKlineChart();
    }

    private updateKlineChart() {
        if (!this.klineChartInstance) return;

        let dates: string[] = [];
        let prices: number[] = [];
        let ohlcData: number[][] = [];

        if (this.klineData && this.klineData.length > 0) {
            // 使用真實API數據
            this.klineData.forEach((kline: any) => {
                dates.push(new Date(kline.openTime).toLocaleDateString());
                prices.push(parseFloat(kline.close));
                ohlcData.push([
                    parseFloat(kline.open),
                    parseFloat(kline.close),
                    parseFloat(kline.low),
                    parseFloat(kline.high)
                ]);
            });
        } else {
            // 假資料作為後備
            const basePrice = 65000;
            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                dates.push(date.toLocaleDateString());
                const volatility = (Math.random() - 0.5) * 0.1;
                const price = basePrice * (1 + volatility * i * 0.1);
                prices.push(Math.round(price));
                ohlcData.push([price, price * 1.02, price * 0.98, price * 1.01]);
            }
        }

        const option = {
            title: {
                text: `${this.baseAsset}/${this.quoteAsset} K線圖`,
                textStyle: { color: '#fff' },
                left: 'left',
                top: 'top'
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const data = params[0];
                    if (ohlcData.length > 0) {
                        const ohlc = ohlcData[data.dataIndex];
                        return `${data.name}<br/>
                               開盤: $${ohlc[0].toFixed(2)}<br/>
                               收盤: $${ohlc[1].toFixed(2)}<br/>
                               最低: $${ohlc[2].toFixed(2)}<br/>
                               最高: $${ohlc[3].toFixed(2)}`;
                    }
                    return `${data.name}<br/>價格: $${data.value}`;
                },
                backgroundColor: 'rgba(0,0,0,0.8)',
                textStyle: { color: '#fff' }
            },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: { color: '#9ca3af', fontSize: 12 },
                axisLine: { lineStyle: { color: '#374151' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#9ca3af', formatter: '${value}', fontSize: 12 },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: '#374151', type: 'dashed' } }
            },
            series: [{
                data: prices,
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: prices.length > 1 && prices[prices.length - 1] >= prices[0] ? '#10b981' : '#ef4444',
                    width: 3
                },
                itemStyle: {
                    color: prices.length > 1 && prices[prices.length - 1] >= prices[0] ? '#10b981' : '#ef4444'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: prices.length > 1 && prices[prices.length - 1] >= prices[0]
                                ? 'rgba(16,185,129,0.2)'
                                : 'rgba(239,68,68,0.2)'
                        },
                        {
                            offset: 1,
                            color: prices.length > 1 && prices[prices.length - 1] >= prices[0]
                                ? 'rgba(16,185,129,0.05)'
                                : 'rgba(239,68,68,0.05)'
                        }
                    ])
                },
                symbol: 'none'
            }],
            backgroundColor: 'transparent',
            grid: {
                left: '8%',
                right: '8%',
                bottom: '15%',
                top: '20%'
            }
        };
        this.klineChartInstance.setOption(option);

        // 更新最新價格
        if (prices.length > 0) {
            this.latestPrice = prices[prices.length - 1];
        }
    }

    private handleResize = () => {
        setTimeout(() => {
            this.klineChartInstance?.resize();
        }, 100);
    };

    // API 數據獲取方法
    async fetchKlineData() {
        if (!this.market) return;

        this.loading = true;
        try {
            const symbol = this.market.replace('/', ''); // 移除斜線，如 BTC/USDT -> BTCUSDT
            // const apiUrl = getKlines(symbol, this.chartInterval, 100);

            // const response = await this.api.get(apiUrl).toPromise() as { code?: string, data?: any };
            // if (response?.code === '0000000' && response.data) {
            //     this.klineData = response.data;
            //     this.updateKlineChart();
            //     this.lastUpdated = new Date().toLocaleTimeString();
            // } else {
            //     // 如果API失敗，生成模擬數據
            //     this.generateMockKlineData();
            //     this.updateKlineChart();
            // }
        } catch (error) {
            console.error('獲取K線數據失敗:', error);
            // 生成模擬數據作為後備
            this.generateMockKlineData();
            this.updateKlineChart();
        }
        this.loading = false;
    }

    private generateMockKlineData() {
        this.klineData = [];
        const basePrice = 45000 + Math.random() * 20000; // 隨機基礎價格
        const now = Date.now();

        for (let i = 99; i >= 0; i--) {
            const time = now - (i * 15 * 60 * 1000); // 15分鐘間隔
            const volatility = (Math.random() - 0.5) * 0.02; // 2%波動
            const open = basePrice * (1 + volatility);
            const change = (Math.random() - 0.5) * 0.01; // 1%變化
            const close = open * (1 + change);
            const high = Math.max(open, close) * (1 + Math.random() * 0.005);
            const low = Math.min(open, close) * (1 - Math.random() * 0.005);

            this.klineData.push({
                openTime: time,
                open: open.toFixed(2),
                high: high.toFixed(2),
                low: low.toFixed(2),
                close: close.toFixed(2),
                volume: (Math.random() * 100).toFixed(4)
            });
        }
    }

    async fetchOrderBook() {
        if (!this.market) return;

        try {
            const symbol = this.market.replace('/', '');
            const apiUrl = apiMarkets.orderbooks(symbol);

            const response = await this.api.get<ApiResponse<OrderBookData>>(apiUrl).toPromise();
            if (response?.code === '0000000' && response.data) {
                this.bidSide = response.data.bids || [];
                this.askSide = response.data.asks || [];

                // 計算最大量，用於訂單簿視覺化
                if (this.bidSide.length > 0) {
                    this.maxBidVolume = Math.max(...this.bidSide.map((bid: any) => parseFloat(bid.volume)));
                }
                if (this.askSide.length > 0) {
                    this.maxAskVolume = Math.max(...this.askSide.map((ask: any) => parseFloat(ask.volume)));
                }
            } else {
                // 生成模擬訂單簿數據
                this.generateMockOrderBook();
            }
        } catch (error) {
            console.error('獲取訂單簿失敗:', error);
            this.generateMockOrderBook();
        }
    }

    private generateMockOrderBook() {
        const basePrice = this.latestPrice || 45000;
        this.bidSide = [];
        this.askSide = [];

        // 生成買單 (低於當前價格)
        for (let i = 0; i < 10; i++) {
            const price = basePrice * (1 - (i + 1) * 0.001);
            const volume = Math.random() * 10;
            this.bidSide.push({ price: price.toFixed(2), volume: volume.toFixed(4) });
        }

        // 生成賣單 (高於當前價格)
        for (let i = 0; i < 10; i++) {
            const price = basePrice * (1 + (i + 1) * 0.001);
            const volume = Math.random() * 10;
            this.askSide.push({ price: price.toFixed(2), volume: volume.toFixed(4) });
        }
    }

    async fetchOpenOrders() {
        // 模擬未成交訂單
        this.openOrders = [];
    }

    async fetchClosedOrders() {
        // 模擬歷史訂單
        this.orderHistory = [];
    }

    async fetchBalances() {
        // 模擬餘額
        this.balances = [
            { asset: this.baseAsset, total: 1.0, locked: 0.0, available: 1.0 },
            { asset: this.quoteAsset, total: 10000.0, locked: 0.0, available: 10000.0 }
        ];
    }

    startAutoRefresh() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);

        this.refreshInterval = setInterval(() => {
            this.fetchKlineData();
            this.fetchOrderBook();
        }, 30000); // 30秒刷新一次
    }
    async placeOrder(side: 'Buy' | 'Sell') { /* TODO: implement */ }
    async placeLimitOrder(side: 'Buy' | 'Sell') { /* TODO: implement */ }
    async placeMarketOrder(side: 'Buy' | 'Sell') { /* TODO: implement */ }
    async cancelOrder(orderId: string) { /* TODO: implement */ }
    async refreshBalances() { /* TODO: implement */ }
    formatAmount(amount: number): string { return amount === 0 ? '0.00000000' : amount < 0.00000001 ? '< 0.00000001' : amount.toFixed(8); }
    getStatusClass(balance: any): string { return balance.total === 0 ? 'status-empty' : balance.locked > 0 ? 'status-locked' : 'status-available'; }
    getStatusText(balance: any): string { return balance.total === 0 ? 'Empty' : balance.locked > 0 ? 'Locked' : 'Available'; }
    formatBalancesForCmd(): string { return JSON.stringify({ summary: { totalAssets: this.balances.length, nonZeroBalances: this.balances.filter(b => b.total > 0).length, timestamp: new Date().toISOString() }, balances: this.balances }, null, 2); }
    changePlaceOrderBtn(btnName: 'Buy' | 'Sell') { this.placeOrderBtn = btnName; }
}
