import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { DataViewModule } from 'primeng/dataview';
import { AvatarModule } from 'primeng/avatar';
import { TranslatePipe } from '@core/i18n/translate.pipe';
import { I18nService } from '@core/i18n/i18n.service';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import * as echarts from 'echarts';

// 介面定義
interface CryptoCurrency {
    name: string;
    symbol: string;
    price: number;
    change: number;
    color: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        PanelModule,
        DataViewModule,
        AvatarModule,
        TranslatePipe
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('priceChart', { static: false }) priceChart!: ElementRef;
    @ViewChild('volumeChart', { static: false }) volumeChart!: ElementRef;
    @ViewChild('portfolioChart', { static: false }) portfolioChart!: ElementRef;

    // 統計卡片數據
    totalAssetValue: number = 127543.21;
    dailyChange: number = 5.67;
    dailyChangePercent: string = '5.67';
    dailyProfitLoss: number = 2847.35;
    dailyProfitLossPercent: string = '2.28';
    totalCoins: number = 12;
    tradingVolume: string = '458.7';
    tradingVolumeUSD: number = 29400000;

    // 加密貨幣數據
    cryptocurrencies: CryptoCurrency[] = [
        {
            name: 'Bitcoin',
            symbol: '₿',
            price: 65234.56,
            change: 2.45,
            color: '#f59e0b'
        },
        {
            name: 'Ethereum',
            symbol: 'Ξ',
            price: 3847.92,
            change: 1.23,
            color: '#3b82f6'
        },
        {
            name: 'Cardano',
            symbol: '₳',
            price: 0.8453,
            change: -0.87,
            color: '#10b981'
        },
        {
            name: 'Polkadot',
            symbol: '●',
            price: 12.67,
            change: 3.45,
            color: '#8b5cf6'
        }
    ];


    private priceChartInstance: any;
    private volumeChartInstance: any;
    private portfolioChartInstance: any;

    // 圖表用翻譯字串
    chartI18n: any = {};
    private chartI18nReady!: Promise<void>;
    private languageSubscription?: Subscription;

    constructor(private i18n: I18nService) {}

    ngOnInit() {
        // 初始化數據 - 可以從服務獲取
        this.loadDashboardData();
        // 預先啟動 chartI18n 載入
        this.chartI18nReady = this.loadChartI18n();
    }

    private async loadChartI18n(): Promise<void> {
        // 確保等待當前語言完全載入
        const currentLang = this.i18n.getCurrentLanguage();
        console.log('Loading chart i18n for language:', currentLang);

        // 等待一小段時間確保 I18nService 的翻譯檔案已載入
        await new Promise(resolve => setTimeout(resolve, 100));

        // 取得所有圖表用的翻譯字串
        const keys = [
            'dashboard.portfolioAnalysis',
            'dashboard.portfolio',
            'dashboard.btcTrend',
            'dashboard.price',
            'dashboard.24hVolume',
            'dashboard.volume',
            'dashboard.24h',
            'dashboard.asset',
            'dashboard.tradeVolume',
            'dashboard.value',
            'dashboard.others',
            'dashboard.tradeVolumeTooltip',
            'dashboard.priceTooltip',
        ];

        // 使用 Promise.all 確保所有翻譯同時載入
        const translations = await Promise.all(
            keys.map(key =>
                new Promise<string>(resolve => {
                    this.i18n.translate(key).subscribe(t => {
                        console.log(`Loaded translation for ${key}: ${t}`);
                        resolve(t);
                    });
                })
            )
        );

        // 建立結果物件
        const result: any = {};
        keys.forEach((key, index) => {
            result[key] = translations[index];
        });

        this.chartI18n = result;
        console.log('Chart i18n loaded:', this.chartI18n);
    }

    ngAfterViewInit() {
        // View 初始化完成後，等 chartI18n 載入完成才初始化圖表
        this.chartI18nReady.then(() => {
            this.initChartsWhenReady();
        });

        // 僅訂閱語言切換事件（跳過初始值）
        this.languageSubscription = this.i18n.currentLanguage$
            .pipe(skip(1)) // 跳過初始值，只監聽真正的語言切換
            .subscribe(async (newLang) => {
                console.log('Language switching detected to:', newLang);

                // 等待語言切換完全完成
                await new Promise(resolve => setTimeout(resolve, 200));

                console.log('Reloading chart i18n...');
                // 確保語言切換是原子操作
                await (this.chartI18nReady = this.loadChartI18n());
                console.log('Chart i18n reloaded, reinitializing charts...');
                this.reinitializeCharts();
            });
    }

    ngOnDestroy() {
        // 清理語言切換訂閱
        if (this.languageSubscription) {
            this.languageSubscription.unsubscribe();
        }

        // 清理事件監聽器
        window.removeEventListener('resize', this.handleResize);
        if (this.priceChartInstance) {
            this.priceChartInstance.dispose();
        }
        if (this.volumeChartInstance) {
            this.volumeChartInstance.dispose();
        }
        if (this.portfolioChartInstance) {
            this.portfolioChartInstance.dispose();
        }
    }

    /**
     * 等待 DOM 元素準備就緒後初始化圖表
     */
    private initChartsWhenReady() {
        // 使用 Promise 來處理多個圖表的初始化
        const initChart = (elementRef: ElementRef, initFunction: () => void): Promise<void> => {
            return new Promise((resolve) => {
                const checkAndInit = () => {
                    if (elementRef?.nativeElement) {
                        const element = elementRef.nativeElement;
                        // 檢查元素是否有正確的尺寸
                        if (element.clientWidth > 0 && element.clientHeight > 0) {
                            try {
                                initFunction();
                                resolve();
                            } catch (error) {
                                console.error('Chart initialization error:', error);
                                resolve(); // 即使出錯也要 resolve，避免阻塞
                            }
                        } else {
                            // 如果尺寸還是 0，再等待一段時間
                            setTimeout(checkAndInit, 50);
                        }
                    } else {
                        // 如果元素還不存在，再等待一段時間
                        setTimeout(checkAndInit, 50);
                    }
                };

                // 初始延遲確保 PrimeNG 組件完全渲染
                setTimeout(checkAndInit, 200);
            });
        };

        // 按順序初始化所有圖表
        Promise.all([
            initChart(this.priceChart, () => this.initPriceChart()),
            initChart(this.volumeChart, () => this.initVolumeChart()),
            initChart(this.portfolioChart, () => this.initPortfolioChart())
        ]).then(() => {
            console.log('All charts initialized successfully');
            // 設置響應式處理
            this.setupResizeHandling();
        }).catch(error => {
            console.error('Chart initialization failed:', error);
        });
    }

    /**
     * 載入儀表板數據
     */
    private loadDashboardData() {
        // 這裡可以從 API 服務獲取真實數據
        // 目前使用模擬數據
        console.log('Dashboard data loaded');
    }



    /**
     * 設置響應式處理
     */
    private setupResizeHandling() {
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * 處理視窗大小變化
     */
    private handleResize = () => {
        setTimeout(() => {
            this.priceChartInstance?.resize();
            this.volumeChartInstance?.resize();
            this.portfolioChartInstance?.resize();
        }, 100);
    }

    /**
     * 手動觸發圖表重新初始化
     */
    reinitializeCharts() {
        // 清理現有圖表
        if (this.priceChartInstance) {
            this.priceChartInstance.dispose();
            this.priceChartInstance = null;
        }
        if (this.volumeChartInstance) {
            this.volumeChartInstance.dispose();
            this.volumeChartInstance = null;
        }
        if (this.portfolioChartInstance) {
            this.portfolioChartInstance.dispose();
            this.portfolioChartInstance = null;
        }

        // 重新初始化
        setTimeout(() => {
            this.initChartsWhenReady();
        }, 100);
    }

    /**
     * 更新統計數據
     */
    updateDashboardData() {
        // 模擬數據更新
        this.totalAssetValue = 127543.21 + (Math.random() - 0.5) * 5000;
        this.dailyChange = (Math.random() - 0.5) * 10;
        this.dailyChangePercent = this.dailyChange.toFixed(2);
        this.dailyProfitLoss = (Math.random() - 0.5) * 3000;
        this.dailyProfitLossPercent = (this.dailyProfitLoss / this.totalAssetValue * 100).toFixed(2);

        // 更新加密貨幣價格
        this.cryptocurrencies = this.cryptocurrencies.map(crypto => ({
            ...crypto,
            price: crypto.price * (1 + (Math.random() - 0.5) * 0.1),
            change: (Math.random() - 0.5) * 10
        }));
    }

    private initPriceChart() {
        this.priceChartInstance = echarts.init(this.priceChart.nativeElement);

        // 模擬比特幣價格數據
        const dates = [];
        const prices = [];
        const basePrice = 65000;

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            dates.push(date.toLocaleDateString());

            const volatility = (Math.random() - 0.5) * 0.1;
            const price = basePrice * (1 + volatility * i * 0.1);
            prices.push(Math.round(price));
        }

        const t = this.chartI18n;
        const option = {
            title: {
                text: t['dashboard.btcTrend'] || 'Bitcoin 價格走勢',
                textStyle: { color: '#ffffff' },
                left: 'left',
                top: 'top'
            },
            tooltip: {
                trigger: 'axis',
                formatter: t['dashboard.priceTooltip'] || '{b}<br/>價格: ${c}',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textStyle: { color: '#ffffff' }
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
                axisLabel: {
                    color: '#9ca3af',
                    formatter: '${value}',
                    fontSize: 12
                },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: '#374151', type: 'dashed' } }
            },
            series: [{
                data: prices,
                type: 'line',
                smooth: true,
                lineStyle: { color: '#10b981', width: 3 },
                itemStyle: { color: '#10b981' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(16, 185, 129, 0.2)' },
                        { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
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

        this.priceChartInstance.setOption(option);
    }

    private initVolumeChart() {
        this.volumeChartInstance = echarts.init(this.volumeChart.nativeElement);

        const volumeData = [];
        for (let i = 0; i < 24; i++) {
            volumeData.push({
                name: `${i}:00`,
                value: Math.round(Math.random() * 1000 + 500)
            });
        }

        const t = this.chartI18n;
        const option = {
            title: {
                text: t['dashboard.24hVolume'] || '24小時交易量',
                textStyle: { color: '#ffffff' },
                left: 'left',
                top: 'top'
            },
            tooltip: {
                trigger: 'axis',
                formatter: t['dashboard.tradeVolumeTooltip'] || '{b}<br/>交易量: {c} BTC',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textStyle: { color: '#ffffff' }
            },
            xAxis: {
                type: 'category',
                data: volumeData.map(item => item.name),
                axisLabel: { color: '#9ca3af', fontSize: 12 },
                axisLine: { lineStyle: { color: '#374151' } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#9ca3af',
                    formatter: '{value} BTC',
                    fontSize: 12
                },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: '#374151', type: 'dashed' } }
            },
            series: [{
                data: volumeData.map(item => item.value),
                type: 'bar',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#3b82f6' },
                        { offset: 1, color: '#1e40af' }
                    ]),
                    borderRadius: [2, 2, 0, 0]
                },
                barWidth: '60%'
            }],
            backgroundColor: 'transparent',
            grid: {
                left: '8%',
                right: '8%',
                bottom: '15%',
                top: '20%'
            }
        };

        this.volumeChartInstance.setOption(option);
    }

    private initPortfolioChart() {
        this.portfolioChartInstance = echarts.init(this.portfolioChart.nativeElement);

        const t = this.chartI18n;
        const portfolioData = [
            { value: 1048, name: 'Bitcoin (BTC)' },
            { value: 735, name: 'Ethereum (ETH)' },
            { value: 580, name: 'Cardano (ADA)' },
            { value: 484, name: 'Polkadot (DOT)' },
            { value: 300, name: t['dashboard.others'] || 'Others' }
        ];

        const option = {
            title: {
                text: t['dashboard.portfolioAnalysis'] || '投資組合分析',
                textStyle: { color: '#ffffff' },
                left: 'center',
                top: 'top'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: ${c} ({d}%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textStyle: { color: '#ffffff' }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'middle',
                textStyle: { color: '#9ca3af', fontSize: 12 },
                itemGap: 10,
                icon: 'circle'
            },
            series: [
                {
                    name: t['dashboard.portfolio'] || '投資組合',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['60%', '55%'],
                    data: portfolioData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    itemStyle: {
                        borderRadius: 5,
                        borderColor: '#1f2937',
                        borderWidth: 2,
                        color: function (params: any) {
                            const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];
                            return colors[params.dataIndex % colors.length];
                        }
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            ],
            backgroundColor: 'transparent'
        };

        this.portfolioChartInstance.setOption(option);
    }
}
