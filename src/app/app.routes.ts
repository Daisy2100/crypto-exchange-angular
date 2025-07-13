import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MarketsComponent } from './pages/markets/markets.component';


import { MarketOrderComponent } from './pages/market-order/market-order.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'about', component: AboutComponent },
    { path: 'markets', component: MarketsComponent },
    { path: 'market-order/:tradingPair', component: MarketOrderComponent },
    { path: 'market-order', component: MarketOrderComponent },
];
