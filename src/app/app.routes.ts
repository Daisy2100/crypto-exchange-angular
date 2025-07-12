import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MarketsComponent } from './pages/markets/markets.component';


export const routes: Routes = [

    { path: '', component: DashboardComponent },
    { path: 'about', component: AboutComponent },
    { path: 'markets', component: MarketsComponent },
];
