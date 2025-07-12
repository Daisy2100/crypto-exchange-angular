import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


export const routes: Routes = [

    { path: '', component: DashboardComponent },
    { path: 'about', component: AboutComponent },
];
