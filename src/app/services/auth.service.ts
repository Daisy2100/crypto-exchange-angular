import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthStoreService } from '@app/store/auth-store.service';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email?: string;
}

export interface AuthResponse {
    code: string;
    message?: string;
    data?: {
        token: string;
        user_id?: string;
        username?: string;
    };
}

export interface UserProfile {
    userId: string;
    username: string;
    email?: string;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = environment.apiUrl;
    private mockMode = environment.mockBackend;

    // Loading state
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    public isLoading$ = this._isLoading$.asObservable();

    // Error state
    private _error$ = new BehaviorSubject<string | null>(null);
    public error$ = this._error$.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
        private authStore: AuthStoreService
    ) {
        // Initialize auth state from localStorage
        this.initializeAuthState();
    }

    /**
     * Initialize auth state from localStorage on service creation
     */
    private initializeAuthState(): void {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        
        if (token && username) {
            this.authStore.setAuthData(token, username);
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.authStore.token;
    }

    /**
     * Get current user's username
     */
    getCurrentUsername(): string | null {
        return this.authStore.username || null;
    }

    /**
     * Get current auth token
     */
    getToken(): string | null {
        return this.authStore.token || null;
    }

    /**
     * Login user
     */
    login(credentials: LoginRequest): Observable<AuthResponse> {
        if (this.mockMode) {
            return this.mockLogin(credentials);
        }

        this._isLoading$.next(true);
        this._error$.next(null);

        return this.http.post<AuthResponse>(`${this.baseUrl}/api/v1/users/login`, credentials)
            .pipe(
                tap(response => {
                    if (response.code === '0000000' && response.data?.token) {
                        this.setAuthData(response.data.token, credentials.username);
                    }
                }),
                catchError(error => {
                    const errorMessage = error?.error?.message || error.message || 'Login failed';
                    this._error$.next(errorMessage);
                    return throwError(() => new Error(errorMessage));
                }),
                tap(() => this._isLoading$.next(false))
            );
    }

    /**
     * Register new user
     */
    register(data: RegisterRequest): Observable<AuthResponse> {
        if (this.mockMode) {
            return this.mockRegister(data);
        }

        this._isLoading$.next(true);
        this._error$.next(null);

        return this.http.post<AuthResponse>(`${this.baseUrl}/api/v1/users/register`, data)
            .pipe(
                catchError(error => {
                    const errorMessage = error?.error?.message || error.message || 'Registration failed';
                    this._error$.next(errorMessage);
                    return throwError(() => new Error(errorMessage));
                }),
                tap(() => this._isLoading$.next(false))
            );
    }

    /**
     * Logout user
     */
    logout(): Observable<any> {
        if (this.mockMode) {
            this.clearAuthData();
            return of({ code: '0000000', message: 'Logged out successfully' });
        }

        return this.http.post(`${this.baseUrl}/api/v1/users/logout`, {})
            .pipe(
                tap(() => this.clearAuthData()),
                catchError(error => {
                    // Clear auth data even if logout API fails
                    this.clearAuthData();
                    return of({ code: '0000000', message: 'Logged out' });
                })
            );
    }

    /**
     * Get user profile
     */
    getProfile(): Observable<UserProfile | null> {
        if (!this.isAuthenticated()) {
            return of(null);
        }

        if (this.mockMode) {
            return of({
                userId: 'mock-user-id',
                username: this.authStore.username || 'MockUser',
                email: 'mockuser@example.com',
                createdAt: new Date().toISOString()
            });
        }

        return this.http.get<any>(`${this.baseUrl}/api/v1/users/profile`)
            .pipe(
                map(response => {
                    if (response.code === '0000000' && response.data) {
                        return response.data as UserProfile;
                    }
                    return null;
                }),
                catchError(() => of(null))
            );
    }

    /**
     * Set auth data to localStorage and store
     */
    private setAuthData(token: string, username: string): void {
        // Clean token (remove quotes if present)
        const cleanToken = token.replace(/^"|"$/g, '');
        
        localStorage.setItem('token', cleanToken);
        localStorage.setItem('username', username);
        this.authStore.setAuthData(cleanToken, username);
    }

    /**
     * Clear auth data from localStorage and store
     */
    private clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.authStore.clearAuth();
    }

    /**
     * Get HTTP headers with auth token
     */
    getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        if (token) {
            headers = headers.set('Authorization', token);
        }

        return headers;
    }

    // ==================== Mock Methods ====================

    private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
        return of({
            code: '0000000',
            message: 'Login successful',
            data: {
                token: `mock-token-${Date.now()}`,
                user_id: 'mock-user-id',
                username: credentials.username
            }
        }).pipe(
            tap(response => {
                if (response.data?.token) {
                    this.setAuthData(response.data.token, credentials.username);
                }
            })
        );
    }

    private mockRegister(data: RegisterRequest): Observable<AuthResponse> {
        return of({
            code: '0000000',
            message: 'Registration successful',
            data: {
                token: '',
                user_id: `user-${Date.now()}`,
                username: data.username
            }
        });
    }
}
