import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketTableOrderComponent } from '@components/market-table-order/market-table-order.component'

@Component({
    selector: 'app-market-order',
    templateUrl: './market-order.component.html',
    styleUrls: ['./market-order.component.scss'],
    imports: [MarketTableOrderComponent]
})
export class MarketOrderComponent implements OnInit {
    tradingPair: string = '';

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        // 獲取路由參數
        this.route.params.subscribe(params => {
            this.tradingPair = params['tradingPair'] || '';
        });
    }
}
