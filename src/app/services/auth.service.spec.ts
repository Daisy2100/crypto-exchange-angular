import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthStoreService } from '@app/store/auth-store.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let mockRouter: jasmine.SpyObj<Router>;
    let authStore: AuthStoreService;

    beforeEach(() => {
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                AuthService,
                AuthStoreService,
                { provide: Router, useValue: mockRouter }
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        authStore = TestBed.inject(AuthStoreService);

        // Clear localStorage before each test
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return false for isAuthenticated when no token', () => {
        expect(service.isAuthenticated()).toBeFalse();
    });

    it('should handle mock login successfully', (done) => {
        service.login({ username: 'testuser', password: 'password' })
            .subscribe(response => {
                expect(response.code).toBe('0000000');
                expect(response.data?.token).toBeDefined();
                expect(service.isAuthenticated()).toBeTrue();
                expect(service.getCurrentUsername()).toBe('testuser');
                done();
            });
    });

    it('should handle mock registration', (done) => {
        service.register({ username: 'newuser', password: 'password' })
            .subscribe(response => {
                expect(response.code).toBe('0000000');
                expect(response.data?.user_id).toBeDefined();
                done();
            });
    });

    it('should clear auth data on logout', (done) => {
        // First login
        service.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            expect(service.isAuthenticated()).toBeTrue();

            // Then logout
            service.logout().subscribe(() => {
                expect(service.isAuthenticated()).toBeFalse();
                expect(service.getCurrentUsername()).toBeNull();
                done();
            });
        });
    });

    it('should get user profile in mock mode', (done) => {
        // First login to have a valid session
        service.login({ username: 'testuser', password: 'password' }).subscribe(() => {
            service.getProfile().subscribe(profile => {
                expect(profile).toBeDefined();
                expect(profile?.username).toBe('testuser');
                done();
            });
        });
    });

    it('should return null profile when not authenticated', (done) => {
        service.getProfile().subscribe(profile => {
            expect(profile).toBeNull();
            done();
        });
    });
});
