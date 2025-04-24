import { inject, Injectable } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Puedes guardar aquí el estado del usuario (login)
  private isLoggedIn = false;

  setLogin(status: boolean) {
    this.isLoggedIn = status;
  }

  getLogin(): boolean {
    return this.isLoggedIn;
  }
}

// Guard como función (Angular 15+)
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.getLogin()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
