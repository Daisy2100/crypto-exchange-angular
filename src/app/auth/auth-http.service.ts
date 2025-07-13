// (移除 class 外部的 isAuthenticated)
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpService {
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
    constructor(private http: HttpClient) { }

    token: string = '';

    private getHeaders(): HttpHeaders {
        this.token = this.formatToken();

        return new HttpHeaders({
            'Content-Type': 'application/json',
            // 'X-Auth-Token': this.token
        });
    }

    private getFileHeaders(): HttpHeaders {
        this.token = this.formatToken();

        return new HttpHeaders({
            // 'X-Auth-Token': this.token
        });
    }

    get<T>(url: string, options: {
        headers?: HttpHeaders | { [header: string]: string | string[] },
        context?: HttpContext,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    } = {}): Observable<T> {
        const headers = this.getHeaders();
        options.withCredentials = true;
        return this.http.get<T>(url, { ...options, headers });
    }

    post<T>(url: string, body: any | null, options: {
        headers?: HttpHeaders | { [header: string]: string | string[] },
        context?: HttpContext,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    } = {}): Observable<T> {
        const headers = this.getHeaders();
        options.withCredentials = true;
        return this.http.post<T>(url, body, { ...options, headers });
    }

    post_file<T>(url: string, body: any | null, options: {
        headers?: HttpHeaders | { [header: string]: string | string[] },
        context?: HttpContext,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    } = {}): Observable<T> {
        const headers = this.getFileHeaders();
        options.withCredentials = true;
        return this.http.post<T>(url, body, { ...options, headers });
    }

    put<T>(url: string, body: any | null, options: {
        headers?: HttpHeaders | { [header: string]: string | string[] },
        context?: HttpContext,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    } = {}): Observable<T> {
        const headers = this.getHeaders();
        options.withCredentials = true;
        return this.http.put<T>(url, body, { ...options, headers });
    }

    delete<T>(url: string, options: {
        headers?: HttpHeaders | { [header: string]: string | string[] },
        context?: HttpContext,
        observe?: 'body',
        params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
        reportProgress?: boolean,
        responseType?: 'json',
        withCredentials?: boolean,
    } = {}): Observable<T> {
        const headers = this.getHeaders();
        options.withCredentials = true;
        return this.http.delete<T>(url, { ...options, headers });
    }

    getToken(): string {
        return this.token;
    }

    formatToken(): string {
        let token = localStorage.getItem('token');
        // 移除 token 開頭和結尾的雙引號（如果存在）
        token = token ? token.replace(/^"|"$/g, '') : '';
        // window['logMessage']('Current token:', this.token);  // 記錄處理後的 token

        return token
    }
}
