import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth.services';

export const authGuard: CanActivateFn = (route, state) => {

  const AuthService = inject(Auth);
  const router = inject(Router);

  if (AuthService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login'])
    return false;
  }
};
