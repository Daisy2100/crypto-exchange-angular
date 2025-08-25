import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AuthState {
  token: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private _state$ = new BehaviorSubject<AuthState>({
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || ''
  });

  readonly state$ = this._state$.asObservable();

  get token() {
    return this._state$.value.token;
  }

  get username() {
    return this._state$.value.username;
  }

  setAuthData(token: string, username: string) {
    this._state$.next({ token, username });
  }

  clearAuth() {
    this._state$.next({ token: '', username: '' });
  }
}
