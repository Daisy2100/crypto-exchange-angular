import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardComponent } from './dashboard.component';
import { I18nService } from '@core/i18n/i18n.service';
import { BehaviorSubject, of } from 'rxjs';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    const mockI18nService = {
        getCurrentLanguage: () => 'en',
        currentLanguage$: new BehaviorSubject('en'),
        translate: () => of('Translation')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideAnimationsAsync(),
                { provide: I18nService, useValue: mockI18nService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have default cryptocurrency data', () => {
        expect(component.cryptocurrencies.length).toBeGreaterThan(0);
    });
});
