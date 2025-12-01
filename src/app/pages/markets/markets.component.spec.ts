import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MarketsComponent } from './markets.component';

describe('MarketsComponent', () => {
  let component: MarketsComponent;
  let fixture: ComponentFixture<MarketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
