import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as echarts from 'echarts';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('priceChart', { static: false }) priceChart!: ElementRef;
    @ViewChild('volumeChart', { static: false }) volumeChart!: ElementRef;
    @ViewChild('portfolioChart', { static: false }) portfolioChart!: ElementRef;

    private priceChartInstance: any;
    private volumeChartInstance: any;
    private portfolioChartInstance: any;

    ngOnInit() {
        // 初始化數據
    }

    ngAfterViewInit() {
        this.initPriceChart();
        this.initVolumeChart();
        this.initPortfolioChart();
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

        const option = {
            title: {
                text: 'Bitcoin 價格走勢',
                textStyle: { color: '#ffffff' }
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{b}<br/>價格: ${c}'
            },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: { color: '#ffffff' },
                axisLine: { lineStyle: { color: '#ffffff' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#ffffff',
                    formatter: '${value}'
                },
                axisLine: { lineStyle: { color: '#ffffff' } },
                splitLine: { lineStyle: { color: '#333333' } }
            },
            series: [{
                data: prices,
                type: 'line',
                smooth: true,
                lineStyle: { color: '#10b981', width: 2 },
                itemStyle: { color: '#10b981' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                        { offset: 1, color: 'rgba(16, 185, 129, 0.1)' }
                    ])
                }
            }],
            backgroundColor: 'transparent',
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%',
                top: '15%'
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

        const option = {
            title: {
                text: '24小時交易量',
                textStyle: { color: '#ffffff' }
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{b}<br/>交易量: {c} BTC'
            },
            xAxis: {
                type: 'category',
                data: volumeData.map(item => item.name),
                axisLabel: { color: '#ffffff' },
                axisLine: { lineStyle: { color: '#ffffff' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#ffffff',
                    formatter: '{value} BTC'
                },
                axisLine: { lineStyle: { color: '#ffffff' } },
                splitLine: { lineStyle: { color: '#333333' } }
            },
            series: [{
                data: volumeData.map(item => item.value),
                type: 'bar',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#3b82f6' },
                        { offset: 1, color: '#1e40af' }
                    ])
                }
            }],
            backgroundColor: 'transparent',
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%',
                top: '15%'
            }
        };

        this.volumeChartInstance.setOption(option);
    }

    private initPortfolioChart() {
        this.portfolioChartInstance = echarts.init(this.portfolioChart.nativeElement);

        const portfolioData = [
            { value: 1048, name: 'Bitcoin (BTC)' },
            { value: 735, name: 'Ethereum (ETH)' },
            { value: 580, name: 'Cardano (ADA)' },
            { value: 484, name: 'Polkadot (DOT)' },
            { value: 300, name: 'Others' }
        ];

        const option = {
            title: {
                text: '投資組合分佈',
                textStyle: { color: '#ffffff' }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: ${c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                textStyle: { color: '#ffffff' }
            },
            series: [
                {
                    name: '投資組合',
                    type: 'pie',
                    radius: '50%',
                    data: portfolioData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    itemStyle: {
                        color: function(params: any) {
                            const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];
                            return colors[params.dataIndex % colors.length];
                        }
                    }
                }
            ],
            backgroundColor: 'transparent'
        };

        this.portfolioChartInstance.setOption(option);
    }

    ngOnDestroy() {
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
}
