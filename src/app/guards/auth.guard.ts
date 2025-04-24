import { inject, Injectable } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('spotify_token')
        : null;
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
