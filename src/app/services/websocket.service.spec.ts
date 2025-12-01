import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { take } from 'rxjs/operators';

describe('WebSocketService', () => {
    let service: WebSocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebSocketService]
        });

        service = TestBed.inject(WebSocketService);
    });

    afterEach(() => {
        service.disconnect();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be connected in mock mode', (done) => {
        service.isConnected$.pipe(take(1)).subscribe(connected => {
            expect(connected).toBeTrue();
            done();
        });
    });

    it('should return connection state', () => {
        const state = service.getConnectionState();
        expect(state).toBeDefined();
        expect(state.isConnected).toBeDefined();
        expect(state.endpoint).toBeDefined();
    });

    it('should subscribe to OHLCV data', fakeAsync(() => {
        const observable = service.subscribeOhlcv('BTC-USDT', '15m');
        expect(observable).toBeDefined();
        
        let receivedData: any = null;
        const subscription = observable.pipe(take(1)).subscribe(data => {
            receivedData = data;
        });
        
        tick(6000); // Wait for mock data generation
        
        expect(receivedData).toBeDefined();
        expect(receivedData.candleData).toBeDefined();
        expect(receivedData.volumeData).toBeDefined();
        
        subscription.unsubscribe();
        service.unsubscribeOhlcv('BTC-USDT', '15m');
    }));

    it('should subscribe to orderbook data', fakeAsync(() => {
        const observable = service.subscribeOrderbook('BTC-USDT');
        expect(observable).toBeDefined();

        let receivedData: any = null;
        const subscription = observable.pipe(take(1)).subscribe(data => {
            receivedData = data;
        });
        
        tick(2000);
        
        expect(receivedData).toBeDefined();
        expect(receivedData.bids).toBeDefined();
        expect(receivedData.asks).toBeDefined();
        
        subscription.unsubscribe();
        service.unsubscribeOrderbook('BTC-USDT');
    }));

    it('should subscribe to markets data', fakeAsync(() => {
        const observable = service.subscribeMarkets();
        expect(observable).toBeDefined();

        let receivedData: any = null;
        const subscription = observable.pipe(take(1)).subscribe(data => {
            receivedData = data;
        });
        
        tick(4000);
        
        expect(receivedData).toBeDefined();
        expect(Array.isArray(receivedData)).toBeTrue();
        
        subscription.unsubscribe();
        service.unsubscribeMarkets();
    }));

    it('should toggle mock mode', () => {
        service.setMockMode(true);
        expect(service.getConnectionState().isConnected).toBeTrue();
    });

    it('should handle unsubscribe operations', () => {
        // These should not throw
        expect(() => service.unsubscribeOhlcv('BTC-USDT', '15m')).not.toThrow();
        expect(() => service.unsubscribeOrderbook('BTC-USDT')).not.toThrow();
        expect(() => service.unsubscribeMarkets()).not.toThrow();
    });
});
