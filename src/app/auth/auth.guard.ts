import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthStoreService } from '@app/store/auth-store.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(
        private authStore: AuthStoreService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authStore.token) {
            return true;
        }

        // Store the attempted URL for redirecting after login
        const returnUrl = state.url;
        
        // Navigate to home page with login trigger
        this.router.navigate(['/'], {
            queryParams: { returnUrl, login: true }
        });

        return false;
    }
}

/**
 * Functional guard for Angular 19+ standalone components
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authStore = inject(AuthStoreService);
    const router = inject(Router);

    if (authStore.token) {
        return true;
    }

    // Store the attempted URL for redirecting after login
    router.navigate(['/'], {
        queryParams: { returnUrl: state.url, login: true }
    });

    return false;
};

/**
 * Guard for routes that should only be accessible when NOT logged in
 * (e.g., login/register pages when already authenticated)
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
    const authStore = inject(AuthStoreService);
    const router = inject(Router);

    if (!authStore.token) {
        return true;
    }

    // Already logged in, redirect to dashboard
    router.navigate(['/']);
    return false;
};
