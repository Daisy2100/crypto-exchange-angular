import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
    let component: NavigationComponent;
    let fixture: ComponentFixture<NavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavigationComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                provideAnimationsAsync()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
