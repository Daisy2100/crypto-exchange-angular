import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MarketTableComponent } from './market-table.component';

describe('MarketTableComponent', () => {
    let component: MarketTableComponent;
    let fixture: ComponentFixture<MarketTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MarketTableComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(MarketTableComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should format price correctly', () => {
        expect(component.formatPrice(12345.67)).toBe('12,345.67');
    });

    it('should format change correctly', () => {
        expect(component.formatChange(0.0245)).toBe('+2.45%');
        expect(component.formatChange(-0.0123)).toBe('-1.23%');
    });

    it('should format volume correctly', () => {
        expect(component.formatVolume(1234567)).toBe('1.23M');
        expect(component.formatVolume(1234)).toBe('1.23K');
    });
});
